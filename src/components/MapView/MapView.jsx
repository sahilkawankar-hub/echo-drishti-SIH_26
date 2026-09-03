import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ImageOverlay,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

/* ----------------------------------------------------------------
   Sub-component: tracks cursor position & zoom and reports them
   ---------------------------------------------------------------- */
function MapEventReporter({ onUpdate }) {
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
  });
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

  /* Pick the correct NDVI image based on the temporal toggle */
  const ndviImg = activeDate === 'after' ? loc.ndviAfter : loc.ndviBefore;

  /* Cursor / zoom info */
  const [mapInfo, setMapInfo] = useState({
    lat: loc.center[0].toFixed(4),
    lng: loc.center[1].toFixed(4),
    zoom: loc.zoom,
  });

  const handleMapUpdate = useCallback((updater) => {
    setMapInfo(updater);
  }, []);

  /* Before/After date change handler — swaps NDVI temporal layer */
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

  /* GeoJSON style for the watershed boundary */
  const boundaryStyle = {
    color: '#38bdf8',
    weight: 2,
    opacity: 0.8,
    fillColor: '#38bdf8',
    fillOpacity: 0.06,
    dashArray: '6 4',
  };

  return (
    <div className="map-wrapper" id="map-wrapper">
      <MapContainer
        center={loc.center}
        zoom={loc.zoom}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* ---- Base Tile Layer (Esri World Imagery) ---- */}
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />

        {/* ---- Fly-to animation on location change ---- */}
        <FlyToLocation center={loc.center} zoom={loc.zoom} />

        {/* ---- Watershed Boundary Polygon ---- */}
        {boundary && (
          <GeoJSON
            key="watershed-boundary"
            data={boundary}
            style={boundaryStyle}
          />
        )}

        {/* ---- NDVI Temporal Overlay ---- */}
        {layers.vegetation && ndviImg && (
          <ImageOverlay
            key={`${loc.id}-${activeDate}`}
            url={ndviImg}
            bounds={loc.ndviBounds}
            opacity={0.55}
          />
        )}

        {/* ---- Photo Survey Markers (pilot site only) ---- */}
        {loc.hasPhotoMarkers &&
          photoPoints.map((point) => (
            <PhotoMarker key={point.id} point={point} />
          ))}

        {/* ---- Saved Site Markers (pilot site only) ---- */}
        {loc.hasSiteMarkers &&
          sitePoints.map((site) => (
            <SiteMarker
              key={site.id}
              site={site}
              onSelect={setSelectedSite}
            />
          ))}

        {/* ---- Event Reporter (cursor coords / zoom) ---- */}
        <MapEventReporter onUpdate={handleMapUpdate} />
      </MapContainer>

      {/* ---- Before / After Toggle ---- */}
      <BeforeAfterToggle onChange={handleDateChange} />

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

      {/* ---- Coordinates / Zoom Info Bar ---- */}
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
      </div>
    </div>
  );
}
