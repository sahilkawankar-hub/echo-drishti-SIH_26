/**
 * Geo-spatial utility functions for polygon area and perimeter calculation.
 *
 * Uses the Shoelace formula (with lat/lng → metric projection) for area
 * and the Haversine formula for distances. No external dependencies.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians.
 */
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine distance between two [lng, lat] coordinate pairs.
 * @returns {number} distance in km
 */
function haversineDistance([lng1, lat1], [lng2, lat2]) {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

/**
 * Calculate the area of a polygon ring (array of [lng, lat] coords)
 * using the spherical excess approximation (Shoelace on projected coords).
 * @param {number[][]} ring - Array of [lng, lat] coordinate pairs
 * @returns {number} area in km²
 */
function ringArea(ring) {
  const n = ring.length;
  if (n < 3) return 0;

  let total = 0;

  for (let i = 0; i < n; i++) {
    const [lng1, lat1] = ring[i];
    const [lng2, lat2] = ring[(i + 1) % n];
    const [lng3, lat3] = ring[(i + 2) % n];

    total += toRad(lng3 - lng1) * Math.sin(toRad(lat2));
  }

  return Math.abs((total * EARTH_RADIUS_KM * EARTH_RADIUS_KM) / 2);
}

/**
 * Calculate the perimeter of a polygon ring in km.
 * @param {number[][]} ring - Array of [lng, lat] coordinate pairs
 * @returns {number} perimeter in km
 */
function ringPerimeter(ring) {
  let total = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    total += haversineDistance(ring[i], ring[i + 1]);
  }
  // close the ring
  if (ring.length > 1) {
    total += haversineDistance(ring[ring.length - 1], ring[0]);
  }
  return total;
}

/**
 * Extract all coordinate rings from a GeoJSON geometry.
 * Supports Polygon, MultiPolygon, and GeometryCollection.
 * @param {object} geometry - GeoJSON geometry object
 * @returns {{ outerRings: number[][][], innerRings: number[][][] }}
 */
function extractRings(geometry) {
  const outerRings = [];
  const innerRings = [];

  if (!geometry) return { outerRings, innerRings };

  if (geometry.type === 'Polygon') {
    outerRings.push(geometry.coordinates[0]);
    for (let i = 1; i < geometry.coordinates.length; i++) {
      innerRings.push(geometry.coordinates[i]);
    }
  } else if (geometry.type === 'MultiPolygon') {
    for (const polygon of geometry.coordinates) {
      outerRings.push(polygon[0]);
      for (let i = 1; i < polygon.length; i++) {
        innerRings.push(polygon[i]);
      }
    }
  } else if (geometry.type === 'GeometryCollection') {
    for (const geom of geometry.geometries) {
      const { outerRings: or, innerRings: ir } = extractRings(geom);
      outerRings.push(...or);
      innerRings.push(...ir);
    }
  }

  return { outerRings, innerRings };
}

/**
 * Calculate the area of a GeoJSON feature/geometry in km².
 * Handles Polygon, MultiPolygon, Feature, and FeatureCollection.
 * @param {object} geojson - GeoJSON object
 * @returns {number} area in km²
 */
export function calculateArea(geojson) {
  if (!geojson) return 0;

  // Handle FeatureCollection
  if (geojson.type === 'FeatureCollection') {
    return geojson.features.reduce((sum, f) => sum + calculateArea(f), 0);
  }

  // Handle Feature
  const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson;
  const { outerRings, innerRings } = extractRings(geometry);

  const outerArea = outerRings.reduce((sum, r) => sum + ringArea(r), 0);
  const holeArea = innerRings.reduce((sum, r) => sum + ringArea(r), 0);

  return outerArea - holeArea;
}

/**
 * Calculate the total perimeter of a GeoJSON feature/geometry in km.
 * @param {object} geojson - GeoJSON object
 * @returns {number} perimeter in km
 */
export function calculatePerimeter(geojson) {
  if (!geojson) return 0;

  if (geojson.type === 'FeatureCollection') {
    return geojson.features.reduce((sum, f) => sum + calculatePerimeter(f), 0);
  }

  const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson;
  const { outerRings } = extractRings(geometry);

  return outerRings.reduce((sum, r) => sum + ringPerimeter(r), 0);
}

/**
 * Extract Leaflet-compatible bounds [[south, west], [north, east]] from GeoJSON.
 * @param {object} geojson - GeoJSON object
 * @returns {[[number, number], [number, number]]} bounds
 */
export function getBoundsFromGeoJSON(geojson) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  function processCoord([lng, lat]) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }

  function processCoords(coords) {
    if (typeof coords[0] === 'number') {
      processCoord(coords);
    } else {
      coords.forEach(processCoords);
    }
  }

  function processGeometry(geom) {
    if (!geom) return;
    if (geom.type === 'GeometryCollection') {
      geom.geometries.forEach(processGeometry);
    } else if (geom.coordinates) {
      processCoords(geom.coordinates);
    }
  }

  if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach((f) => processGeometry(f.geometry));
  } else if (geojson.type === 'Feature') {
    processGeometry(geojson.geometry);
  } else {
    processGeometry(geojson);
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}
