import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ImageOverlay,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-rotate';
import './MapView.css';

import { locations } from '../../data/locations';

import watershedBoundaryRaw from '../../data/watershedBoundary.geojson?raw';
const watershedBoundary = JSON.parse(watershedBoundaryRaw);

import photoPoints from '../../data/photoPoints';
import PhotoMarker from '../PhotoMarker/PhotoMarker';
import BeforeAfterToggle from '../BeforeAfterToggle/BeforeAfterToggle';
import sitePoints from '../../data/sitePoints';
import SiteMarker from '../SiteMarker/SiteMarker';
import SiteDetailPanel from '../SiteDetailPanel/SiteDetailPanel';
import NdviLegend from '../NdviLegend/NdviLegend';
import BoundarySearch from '../BoundarySearch/BoundarySearch';
import CompassRose, { ScaleBarControl } from '../CompassRose/CompassRose';
import MeasureToolOverlay, { MeasureMapLayer } from '../MeasureTool/MeasureTool';
import MapDetailsPanel, { MAP_TYPES, DATA_LAYERS } from '../MapDetailsPanel/MapDetailsPanel';
import AddStructureModal from '../AddStructureModal/AddStructureModal';
import ElevationProfile from '../ElevationProfile/ElevationProfile';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

/* ----------------------------------------------------------------
   Sub-component: tracks cursor position & zoom and reports them
   ---------------------------------------------------------------- */
function MapEventReporter({ onUpdate, isProposing, onMapClick }) {
  const map = useMap();

  useMapEvents({
    mousemove(e) {
      onUpdate((prev) => ({
        ...prev,
        lat: e.latlng.lat.toFixed(4),
        lng: e.latlng.lng.toFixed(4),
      }));
    },
    zoomend(e) {
      onUpdate((prev) => ({ ...prev, zoom: e.target.getZoom() }));
    },
    click(e) {
      if (isProposing) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  useEffect(() => {
    const container = map.getContainer();
    if (isProposing) {
      container.style.cursor = 'crosshair';
    } else {
      container.style.cursor = '';
    }
  }, [map, isProposing]);

  return null;
}

/* ----------------------------------------------------------------
   Sub-component: Google Maps-style map rotation controller
   ---------------------------------------------------------------- */
function MapRotationController({ onMapReady, onBearingChange }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    onMapReady(map);

    const handleRotate = () => {
      if (typeof map.getBearing === 'function') {
        const b = map.getBearing() || 0;
        const normalized = ((b % 360) + 360) % 360;
        onBearingChange(normalized);
      }
    };

    map.on('rotate', handleRotate);
    return () => {
      map.off('rotate', handleRotate);
    };
  }, [map, onMapReady, onBearingChange]);

  return null;
}

/* ----------------------------------------------------------------
   Sub-component: smoothly flies the map to a new location
   ---------------------------------------------------------------- */
function FlyToLocation({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom != null) {
      map.flyTo(center, zoom, { duration: 1.4 });
    }
  }, [map, center, zoom]);

  return null;
}

/* ----------------------------------------------------------------
   Sub-component: fits the map to searched boundary bounds
   ---------------------------------------------------------------- */
function FitSearchedBounds({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      const leafletBounds = L.latLngBounds(
        L.latLng(bounds[0][0], bounds[0][1]),
        L.latLng(bounds[1][0], bounds[1][1])
      );
      map.flyToBounds(leafletBounds, {
        padding: [50, 50],
        duration: 1.4,
        maxZoom: 16,
      });
    }
  }, [map, bounds]);

  return null;
}

/* ================================================================
   MapView — main full-screen map component
   ================================================================ */
export default function MapView({
  layers,
  activeLocationId,
  selectedSite: propSelectedSite,
  onSelectSite: propOnSelectSite,
  initialSiteId,
}) {
  const { lang, t } = useLanguage();
  const { isOfficer } = useAuth();

  /* Resolve the active location from the registry */
  const loc = useMemo(
    () => locations.find((l) => l.id === activeLocationId) || locations[0],
    [activeLocationId],
  );

  /* Boundary GeoJSON — only for locations that have one */
  const boundary = loc.hasBoundary ? watershedBoundary : null;

  /* Temporal state — which NDVI snapshot to display */
  const [activeDate, setActiveDate] = useState('before');

  /* Selected site for the detail panel (controlled or local fallback) */
  const [internalSelectedSite, setInternalSelectedSite] = useState(null);
  const selectedSite = propSelectedSite !== undefined ? propSelectedSite : internalSelectedSite;
  const setSelectedSite = propOnSelectSite || setInternalSelectedSite;

  useEffect(() => {
    if (initialSiteId) {
      const match = sitePoints.find((s) => s.id === initialSiteId);
      if (match) {
        setSelectedSite(match);
      }
    }
  }, [initialSiteId, setSelectedSite]);

  /* --- Searched Boundary State (from BoundarySearch) --- */
  const [searchedBoundary, setSearchedBoundary] = useState(null);
  const [searchedBoundaryInfo, setSearchedBoundaryInfo] = useState(null);
  const [searchedBounds, setSearchedBounds] = useState(null);

  /* --- Map Type & Data Overlay State --- */
  const [activeMapTypeId, setActiveMapTypeId] = useState('satellite');
  const [activeOverlays, setActiveOverlays] = useState([]);

  /* --- Measure Tool State --- */
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [measureMousePos, setMeasureMousePos] = useState(null);

  /* --- NEW FEATURE: Proposed Structure Pinning State (Officer Only) --- */
  const [isProposingStructure, setIsProposingStructure] = useState(false);
  const [newStructureCoords, setNewStructureCoords] = useState(null);
  const [customProposedStructures, setCustomProposedStructures] = useState([]);

  /* --- NEW FEATURE: Elevation Profile State --- */
  const [isElevationOpen, setIsElevationOpen] = useState(false);

  /* --- Google Maps Style Bearing / Map Rotation State --- */
  const [bearing, setBearing] = useState(0);
  const [mapInstance, setMapInstance] = useState(null);

  const handleRotateLeft = useCallback(() => {
    if (mapInstance && typeof mapInstance.setBearing === 'function') {
      const cur = mapInstance.getBearing() || 0;
      const next = cur - 15;
      mapInstance.setBearing(next);
      setBearing(((next % 360) + 360) % 360);
    }
  }, [mapInstance]);

  const handleRotateRight = useCallback(() => {
    if (mapInstance && typeof mapInstance.setBearing === 'function') {
      const cur = mapInstance.getBearing() || 0;
      const next = cur + 15;
      mapInstance.setBearing(next);
      setBearing(((next % 360) + 360) % 360);
    }
  }, [mapInstance]);

  const handleResetNorth = useCallback(() => {
    if (mapInstance && typeof mapInstance.setBearing === 'function') {
      mapInstance.setBearing(0);
      setBearing(0);
    }
  }, [mapInstance]);

  /* Resolve the active map type definition */
  const activeMapType = useMemo(
    () => MAP_TYPES.find((t) => t.id === activeMapTypeId) || MAP_TYPES[0],
    [activeMapTypeId],
  );

  /* Resolve active overlay layer definitions */
  const activeOverlayDefs = useMemo(
    () => DATA_LAYERS.filter((l) => activeOverlays.includes(l.id)),
    [activeOverlays],
  );

  /* Pick the correct NDVI image based on the temporal toggle */
  const ndviImg = activeDate === 'after' ? loc.ndviAfter : loc.ndviBefore;

  /* Pick the correct NDWI (Water) image based on the temporal toggle */
  const ndwiImg = activeDate === 'after' ? (loc.ndwiAfter || loc.ndviAfter) : (loc.ndwiBefore || loc.ndviBefore);

  /* Land use / land cover classification image */
  const landuseImg = loc.landuse;

  /* Cursor / zoom info */
  const [mapInfo, setMapInfo] = useState({
    lat: loc.center[0].toFixed(4),
    lng: loc.center[1].toFixed(4),
    zoom: loc.zoom,
  });

  const handleMapUpdate = useCallback((updater) => {
    setMapInfo(updater);
  }, []);

  /* Before/After date change handler */
  const handleDateChange = useCallback((date) => {
    setActiveDate(date);
  }, []);

  /* Select initial site if provided from dashboard navigation */
  useEffect(() => {
    if (initialSiteId) {
      const match = sitePoints.find((s) => s.id === initialSiteId);
      if (match) setSelectedSite(match);
    }
  }, [initialSiteId, setSelectedSite]);

  /* Close any open site panel when switching locations */
  useEffect(() => {
    setSelectedSite(null);
  }, [activeLocationId, setSelectedSite]);

  /* --- Boundary Search Handlers --- */
  const handleBoundaryFound = useCallback((geojson, info, bounds) => {
    setSearchedBoundary(geojson);
    setSearchedBoundaryInfo(info);
    setSearchedBounds(bounds);
  }, []);

  const handleBoundaryCleared = useCallback(() => {
    setSearchedBoundary(null);
    setSearchedBoundaryInfo(null);
    setSearchedBounds(null);
  }, []);

  /* --- Map Type & Overlay Handlers --- */
  const handleMapTypeChange = useCallback((mapType) => {
    setActiveMapTypeId(mapType.id);
  }, []);

  const handleToggleOverlay = useCallback((layer) => {
    setActiveOverlays((prev) =>
      prev.includes(layer.id)
        ? prev.filter((id) => id !== layer.id)
        : [...prev, layer.id]
    );
  }, []);

  /* --- Proposed Structure Handlers --- */
  const handleMapClickForProposal = useCallback((coords) => {
    setNewStructureCoords(coords);
    setIsProposingStructure(false);
  }, []);

  const handleSaveProposedStructure = useCallback((newStructure) => {
    setCustomProposedStructures((prev) => [newStructure, ...prev]);
    setNewStructureCoords(null);
    setSelectedSite(newStructure);
  }, [setSelectedSite]);

  /* GeoJSON style for watershed boundary */
  const boundaryStyle = {
    color: '#38bdf8',
    weight: 2,
    opacity: 0.8,
    fillColor: '#38bdf8',
    fillOpacity: 0.06,
    dashArray: '6 4',
  };

  /* Dotted red boundary style for searched boundaries */
  const searchedBoundaryStyle = {
    color: '#ef4444',
    weight: 3,
    opacity: 0.9,
    fillColor: '#ef4444',
    fillOpacity: 0.08,
    dashArray: '10 6',
  };

  return (
    <div className="map-wrapper" id="map-wrapper">
      <MapContainer
        center={loc.center}
        zoom={loc.zoom}
        zoomControl={true}
        rotate={true}
        touchRotate={true}
        shiftKeyRotate={true}
        rotateControl={false}
        bearing={bearing}
        style={{ width: '100%', height: '100%' }}
      >
        {/* ---- Base Tile Layer (Dynamic) ---- */}
        <TileLayer
          key={`base-${activeMapType.id}`}
          attribution={activeMapType.attribution}
          url={activeMapType.url}
          maxZoom={activeMapType.maxZoom}
        />

        {/* ---- Hybrid Label Overlay ---- */}
        {activeMapType.overlay && (
          <TileLayer
            key={`overlay-${activeMapType.id}`}
            url={activeMapType.overlay.url}
            attribution={activeMapType.overlay.attribution}
            maxZoom={19}
            opacity={0.9}
          />
        )}

        {/* ---- Data Overlay Layers ---- */}
        {activeOverlayDefs.map((layer) => (
          <TileLayer
            key={`data-overlay-${layer.id}`}
            url={layer.url}
            attribution={layer.attribution}
            maxZoom={layer.maxZoom}
            opacity={layer.opacity}
          />
        ))}

        {/* ---- Fly-to animation on location change ---- */}
        <FlyToLocation center={loc.center} zoom={loc.zoom} />

        {/* ---- Fit to searched boundary bounds ---- */}
        {searchedBounds && <FitSearchedBounds bounds={searchedBounds} />}

        {/* ---- Leaflet Scale Bar ---- */}
        <ScaleBarControl />

        {/* ---- Watershed Boundary Polygon ---- */}
        {boundary && (
          <GeoJSON
            key="watershed-boundary"
            data={boundary}
            style={boundaryStyle}
          />
        )}

        {/* ---- Searched Boundary Polygon (Dotted Red) ---- */}
        {searchedBoundary && (
          <GeoJSON
            key={`searched-boundary-${searchedBoundaryInfo?.name || 'unknown'}`}
            data={searchedBoundary}
            style={searchedBoundaryStyle}
          />
        )}

        {/* ---- Vegetation Health (NDVI) Overlay ---- */}
        {layers.vegetation && ndviImg && (
          <ImageOverlay
            key={`${loc.id}-ndvi-${activeDate}`}
            url={ndviImg}
            bounds={loc.ndviBounds}
            opacity={0.55}
          />
        )}

        {/* ---- Water (NDWI) Temporal Overlay ---- */}
        {layers.water && ndwiImg && (
          <ImageOverlay
            key={`${loc.id}-ndwi-${activeDate}`}
            url={ndwiImg}
            bounds={loc.ndviBounds}
            opacity={0.7}
          />
        )}

        {/* ---- Land Use / Land Cover (LULC) Overlay ---- */}
        {layers.landuse && landuseImg && (
          <ImageOverlay
            key={`${loc.id}-landuse`}
            url={landuseImg}
            bounds={loc.ndviBounds}
            opacity={0.6}
          />
        )}

        {/* ---- Photo Survey Markers ---- */}
        {loc.hasPhotoMarkers &&
          photoPoints.map((point) => (
            <PhotoMarker key={point.id} point={point} />
          ))}

        {/* ---- Saved Ground Water Asset Markers ---- */}
        {loc.hasSiteMarkers &&
          sitePoints
            .filter((site) => site.locationId === loc.id || (!site.locationId && loc.id === 'chandur-railway'))
            .map((site) => (
              <SiteMarker
                key={site.id}
                site={site}
                onSelect={setSelectedSite}
              />
            ))}

        {/* ---- Officer Custom Proposed Structures (Dynamically added) ---- */}
        {customProposedStructures.map((struct) => (
          <SiteMarker
            key={struct.id}
            site={struct}
            onSelect={setSelectedSite}
          />
        ))}

        {/* ---- Measure Tool Map Layer ---- */}
        <MeasureMapLayer
          isActive={isMeasuring}
          points={measurePoints}
          setPoints={setMeasurePoints}
          mousePos={measureMousePos}
          setMousePos={setMeasureMousePos}
        />

        {/* ---- Google Maps Rotation Controller ---- */}
        <MapRotationController
          onMapReady={setMapInstance}
          onBearingChange={setBearing}
        />

        {/* ---- Event Reporter ---- */}
        <MapEventReporter
          onUpdate={handleMapUpdate}
          isProposing={isProposingStructure}
          onMapClick={handleMapClickForProposal}
        />
      </MapContainer>

      {/* ---- Boundary Search Overlay ---- */}
      <BoundarySearch
        onBoundaryFound={handleBoundaryFound}
        onBoundaryCleared={handleBoundaryCleared}
      />

      {/* ---- GIS Quick Action Toolbar (Top-Left under Search) ---- */}
      <div className="map-gis-tools-bar" id="map-gis-tools-bar">
        {/* Elevation Profile Toggle Button */}
        <button
          type="button"
          className={`map-gis-btn ${isElevationOpen ? 'map-gis-btn--active' : ''}`}
          onClick={() => setIsElevationOpen((prev) => !prev)}
          id="toggle-elevation-btn"
        >
          📈 {t.elevationBtn}
        </button>

        {/* Officer-Only: Propose New Water Asset */}
        {isOfficer && (
          <>
            <button
              type="button"
              className={`map-gis-btn map-gis-btn--propose ${isProposingStructure ? 'map-gis-btn--propose-active' : ''}`}
              onClick={() => setIsProposingStructure((prev) => !prev)}
              id="propose-structure-btn"
            >
              {isProposingStructure ? `📍 ${t.addStructureActive}` : `➕ ${t.addStructureBtn}`}
            </button>
            <span className="map-gis-badge-officer" title="Department Officer Privilege Active">
              🛡️ {lang === 'hi' ? 'अधिकारी संपादन' : 'Officer Edit'}
            </span>
          </>
        )}
      </div>

      {/* ---- Proposing Location Active Banner ---- */}
      {isProposingStructure && (
        <div className="propose-banner" id="propose-banner">
          <span className="propose-pulse-dot" />
          <span>{t.addStructureActive}</span>
          <button
            type="button"
            className="propose-banner-cancel"
            onClick={() => setIsProposingStructure(false)}
          >
            ✕ {t.close}
          </button>
        </div>
      )}

      {/* ---- Add Structure Modal (Opens when officer clicks map) ---- */}
      {newStructureCoords && (
        <AddStructureModal
          coordinates={newStructureCoords}
          onSave={handleSaveProposedStructure}
          onCancel={() => setNewStructureCoords(null)}
        />
      )}

      {/* ---- Elevation & Catchment Topography Profile Panel ---- */}
      <ElevationProfile
        isOpen={isElevationOpen}
        onClose={() => setIsElevationOpen(false)}
      />

      {/* ---- Compass Rose (Google Maps Rotation Control) ---- */}
      <CompassRose
        bearing={bearing}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onResetNorth={handleResetNorth}
      />

      {/* ---- Map Details Panel (Map types + Data layers) ---- */}
      <MapDetailsPanel
        activeMapType={activeMapTypeId}
        onMapTypeChange={handleMapTypeChange}
        activeOverlays={activeOverlays}
        onToggleOverlay={handleToggleOverlay}
      />

      {/* ---- Measure Tool UI Overlay ---- */}
      <MeasureToolOverlay
        isActive={isMeasuring}
        setIsActive={setIsMeasuring}
        points={measurePoints}
        setPoints={setMeasurePoints}
        mousePos={measureMousePos}
      />

      {/* ---- Before / After Toggle (Stacked below Pilot Study Basin) ---- */}
      <BeforeAfterToggle
        value={activeDate}
        onChange={handleDateChange}
        isPanelOpen={!!selectedSite}
      />

      {/* ---- Site Detail Panel (slide-in) ---- */}
      {selectedSite && (
        <SiteDetailPanel
          key={selectedSite.id}
          site={selectedSite}
          activeLocation={loc}
          activeDate={activeDate}
          onClose={() => setSelectedSite(null)}
        />
      )}

      {/* ---- NDVI Color Scale Legend ---- */}
      {layers.vegetation && (
        <NdviLegend activeDate={activeDate} />
      )}

      {/* ---- Coordinates / Zoom & Photo Resolution Info Bar ---- */}
      <div className="map-info" id="map-info">
        <span>
          <span className="map-info__label">Lat</span>
          <span className="map-info__value">{mapInfo.lat}</span>
        </span>
        <span>
          <span className="map-info__label">Lng</span>
          <span className="map-info__value">{mapInfo.lng}</span>
        </span>
        <span>
          <span className="map-info__label">Zoom</span>
          <span className="map-info__value">{mapInfo.zoom}</span>
        </span>
        <span>
          <span className="map-info__label">📷 {lang === 'hi' ? 'रिज़ॉल्यूशन' : 'Res'}</span>
          <span className="map-info__value" style={{ color: '#38bdf8' }}>
            {(156543.03392 * Math.cos((parseFloat(mapInfo.lat) || 20) * Math.PI / 180) / Math.pow(2, mapInfo.zoom || 13)).toFixed(1)} m/px
          </span>
        </span>
        <span>
          <span className="map-info__label">🛰️ {lang === 'hi' ? 'सेंसर' : 'Sensor GSD'}</span>
          <span className="map-info__value" style={{ color: '#10b981' }}>
            {mapInfo.zoom >= 16 ? '0.5m Optical Aerial' : '10m Sentinel-2'}
          </span>
        </span>
      </div>
    </div>
  );
}
