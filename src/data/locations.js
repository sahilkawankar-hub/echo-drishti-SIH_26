/**
 * Central location registry for the Watershed Monitor.
 *
 * Each location defines its map centre, zoom, NDVI overlay bounds and imagery,
 * and flags indicating which map features are available at that site.
 *
 * Consumers can import { locations, DEFAULT_LOCATION_ID } and look up any
 * location by id without needing to touch MapView internals.
 */

/* ----------------------------------------------------------------
   Existing Chandur Railway (Pilot) NDVI imagery
   ---------------------------------------------------------------- */
import ndviBeforeChandur from '../assets/ndvi_before_2025-12-01.png';
import ndviAfterChandur from '../assets/ndvi_after_2026-06-04.png';
import ndwiBeforeChandur from '../assets/ndwi_before.png';
import ndwiAfterChandur from '../assets/ndwi_after.png';
import landuseChandur from '../assets/landuse.png';

/* ----------------------------------------------------------------
   Reference-site NDVI imagery (Hiware Bazar & Ralegan Siddhi)
   ---------------------------------------------------------------- */
import ndviBeforeHB from '../assets/reference-sites/before_HB.png';
import ndviAfterHB from '../assets/reference-sites/after_HB.png';
import ndviBeforeRS from '../assets/reference-sites/before_RS.png';
import ndviAfterRS from '../assets/reference-sites/after_RS.png';

/* ----------------------------------------------------------------
   Helper: compute NDVI overlay bounds from a centre point
   ----------------------------------------------------------------
   Approximation used:
     1 km ≈ 0.009°  latitude
     1 km ≈ 0.0097° longitude
   `offset` shifts the centre before calculating the rectangle.
   Returns [[south, west], [north, east]].
   ---------------------------------------------------------------- */
export function boundsFromCenter(lat, lng, offset = { lat: 0, lng: 0 }, sizeKm = 5) {
  const halfLat = (sizeKm / 2) * 0.009;
  const halfLng = (sizeKm / 2) * 0.0097;

  const cLat = lat + (offset.lat || 0);
  const cLng = lng + (offset.lng || 0);

  return [
    [cLat - halfLat, cLng - halfLng],  // south-west
    [cLat + halfLat, cLng + halfLng],  // north-east
  ];
}

/* ================================================================
   Location entries
   ================================================================ */

export const locations = [
  /* ---------- Pilot Site ---------- */
  {
    id: 'chandur-railway',
    name: 'Chandur Railway, Amravati',
    type: 'pilot',
    center: [20.82, 77.98],
    zoom: 13,
    /* Exact bounds already validated in the original MapView — kept unchanged */
    ndviBounds: [
      [20.807151, 77.960358],  // south-west
      [20.832863, 77.999668],  // north-east
    ],
    ndviBefore: ndviBeforeChandur,
    ndviAfter: ndviAfterChandur,
    ndwiBefore: ndwiBeforeChandur,
    ndwiAfter: ndwiAfterChandur,
    landuse: landuseChandur,
    hasPhotoMarkers: true,
    hasSiteMarkers: true,
    hasBoundary: true,
  },

  /* ---------- Reference Cases ---------- */
  {
    id: 'hiware-bazar',
    name: 'Hiware Bazar',
    type: 'reference',
    center: [19.0728, 74.0182],
    zoom: 14,
    ndviBounds: boundsFromCenter(19.0728, 74.0182, { lat: 0, lng: -0.003 }, 5.5),
    ndviBefore: ndviBeforeHB,
    ndviAfter: ndviAfterHB,
    hasPhotoMarkers: false,
    hasSiteMarkers: false,
    hasBoundary: false,
  },
  {
    id: 'ralegan-siddhi',
    name: 'Ralegan Siddhi',
    type: 'reference',
    center: [19.1642, 74.4300],
    zoom: 14,
    ndviBounds: boundsFromCenter(19.1642, 74.4300, { lat: 0, lng: -0.004 }, 5.5),
    ndviBefore: ndviBeforeRS,
    ndviAfter: ndviAfterRS,
    hasPhotoMarkers: false,
    hasSiteMarkers: false,
    hasBoundary: false,
  },
];

/** Compatibility alias for pilot site */
locations.chandur = locations[0];

/** Existing NDVI overlay bounds for Chandur pilot site */
export const NDVI_OVERLAY_BOUNDS = locations[0].ndviBounds;

/** The location id to use on initial load */
export const DEFAULT_LOCATION_ID = 'chandur-railway';
