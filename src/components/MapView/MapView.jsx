import { useState, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ImageOverlay,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

import watershedBoundaryRaw from '../../data/watershedBoundary.geojson?raw';
const watershedBoundary = JSON.parse(watershedBoundaryRaw);

import ndviBeforeImg from '../../assets/ndvi_before_2025-12-01.png';
import ndviAfterImg from '../../assets/ndvi_after_2026-06-04.png';

import photoPoints from '../../data/photoPoints';
import PhotoMarker from '../PhotoMarker/PhotoMarker';
import BeforeAfterToggle from '../BeforeAfterToggle/BeforeAfterToggle';
import sitePoints from '../../data/sitePoints';
import SiteMarker from '../SiteMarker/SiteMarker';
import SiteDetailPanel from '../SiteDetailPanel/SiteDetailPanel';
import NdviLegend from '../NdviLegend/NdviLegend';

/* ----------------------------------------------------------------
   Default map centre & zoom — update these later
   ---------------------------------------------------------------- */
const DEFAULT_CENTER = [20.82, 77.98]; // Chandur Railway, Amravati district
const DEFAULT_ZOOM = 13;

/* ----------------------------------------------------------------
   Real NDVI overlay bounds derived from the Sentinel-2 GeoTIFF.
   Both before & after images share the same geographic extent.
   Format: [[south, west], [north, east]]
   ---------------------------------------------------------------- */
const NDVI_OVERLAY_BOUNDS = [
  [20.807151, 77.960358], // south-west
  [20.832863, 77.999668], // north-east
];

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

/* ================================================================
   MapView — main full-screen map component
   ================================================================ */
export default function MapView({ layers }) {
  /* Boundary GeoJSON */
  const boundary = watershedBoundary;


  /* Temporal state — which NDVI snapshot to display */
  const [activeDate, setActiveDate] = useState('before');

  /* Selected site for the detail panel (null = panel closed) */
  const [selectedSite, setSelectedSite] = useState(null);

  /* Pick the correct NDVI image based on the temporal toggle */
  const ndviImg = activeDate === 'after' ? ndviAfterImg : ndviBeforeImg;

  /* Cursor / zoom info */
  const [mapInfo, setMapInfo] = useState({
    lat: DEFAULT_CENTER[0].toFixed(4),
    lng: DEFAULT_CENTER[1].toFixed(4),
    zoom: DEFAULT_ZOOM,
  });

  const handleMapUpdate = useCallback((updater) => {
    setMapInfo(updater);
  }, []);

  /* Before/After date change handler — swaps NDVI temporal layer */
  const handleDateChange = useCallback((date) => {
    setActiveDate(date);
  }, []);

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
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* ---- Base Tile Layer (OpenStreetMap) ---- */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ---- Watershed Boundary Polygon ---- */}
        {boundary && (
          <GeoJSON
            key="watershed-boundary"
            data={boundary}
            style={boundaryStyle}
          />
        )}

        {/* ---- NDVI Temporal Overlay — real Sentinel-2 PNG ---- */}
        {layers.vegetation && (
          <ImageOverlay
            key={activeDate}
            url={ndviImg}
            bounds={NDVI_OVERLAY_BOUNDS}
            opacity={0.55}
          />
        )}

        {/* ---- Photo Survey Markers ---- */}
        {photoPoints.map((point) => (
          <PhotoMarker key={point.id} point={point} />
        ))}

        {/* ---- Saved Site Markers ---- */}
        {sitePoints.map((site) => (
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
