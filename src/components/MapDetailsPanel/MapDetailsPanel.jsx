import { useState, useRef, useEffect } from 'react';
import './MapDetailsPanel.css';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Tile layer source definitions from well-known official data providers.
 */
export const MAP_TYPES = [
  {
    id: 'satellite',
    name: 'Satellite',
    nameHi: 'उपग्रह',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; National Satellite Feed',
    maxZoom: 19,
  },
  {
    id: 'streets',
    name: 'Streets',
    nameHi: 'सड़कें',
    icon: '🗺️',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  {
    id: 'terrain',
    name: 'Terrain',
    nameHi: 'स्थलाकृति',
    icon: '⛰️',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap (CC-BY-SA)',
    maxZoom: 17,
  },
];

/**
 * Overlay data layers from well-known open and government-grade sources.
 */
export const DATA_LAYERS = [
  {
    id: 'labels',
    name: 'Administrative Labels',
    nameHi: 'प्रशासनिक सीमा नाम व सड़कें',
    icon: '🏷️',
    description: 'Bilingual district & tehsil labels',
    descHi: 'जिला एवं तहसील प्रशासनिक नाम',
    url: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO GIS',
    maxZoom: 19,
    opacity: 0.9,
  },
  {
    id: 'openweather-clouds',
    name: 'Cloud Cover Overlay',
    nameHi: 'मेघ आवरण (बादल)',
    icon: '☁️',
    description: 'Satellite cloud telemetry',
    descHi: 'उपग्रह मेघ आच्छादन टेलीमेट्री',
    url: 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2',
    attribution: '&copy; OpenWeatherMap',
    maxZoom: 19,
    opacity: 0.5,
  },
  {
    id: 'openweather-precipitation',
    name: 'Precipitation Radar',
    nameHi: 'वर्षा रडार आवरण',
    icon: '🌧️',
    description: 'Catchment precipitation radar',
    descHi: 'जलसंभर वर्षा सघनता रडार',
    url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2',
    attribution: '&copy; OpenWeatherMap',
    maxZoom: 19,
    opacity: 0.6,
  },
  {
    id: 'openweather-temp',
    name: 'Surface Temperature',
    nameHi: 'सतही तापमान',
    icon: '🌡️',
    description: 'Thermal hydro-metering',
    descHi: 'सतही तापीय जल माप',
    url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2',
    attribution: '&copy; OpenWeatherMap',
    maxZoom: 19,
    opacity: 0.5,
  },
  {
    id: 'openweather-wind',
    name: 'Wind Velocity Stream',
    nameHi: 'पवन वेग प्रवाह',
    icon: '💨',
    description: 'Surface wind vector',
    descHi: 'सतही वायु गति एवं दिशा',
    url: 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=9de243494c0b295cca9337e1e96b00e2',
    attribution: '&copy; OpenWeatherMap',
    maxZoom: 19,
    opacity: 0.5,
  },
];

/**
 * MapDetailsPanel — Official GIS Imagery & Tile Source Selector.
 */
export default function MapDetailsPanel({
  activeMapType,
  onMapTypeChange,
  activeOverlays,
  onToggleOverlay,
}) {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="map-details" ref={containerRef} id="map-details-panel">
      {/* ---- Toggle Button ---- */}
      <button
        className={`map-details__btn${isOpen ? ' map-details__btn--active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title={t.mapDetailsBtn}
        id="map-details-btn"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
      </button>

      {/* ---- Official Panel ---- */}
      {isOpen && (
        <div className="map-details__panel" id="map-details-popover">
          {/* Map Type Section */}
          <div className="map-details__section">
            <div className="map-details__section-header">
              <span className="map-details__section-title">{t.mapTypesTitle}</span>
            </div>
            <div className="map-details__type-grid">
              {MAP_TYPES.map((type) => {
                const isActive = activeMapType === type.id;
                return (
                  <button
                    key={type.id}
                    className={`map-details__type-card${isActive ? ' map-details__type-card--active' : ''}`}
                    onClick={() => onMapTypeChange(type)}
                    id={`map-type-${type.id}`}
                    type="button"
                  >
                    <span className="map-details__type-icon">{type.icon}</span>
                    <span className="map-details__type-name">
                      {lang === 'hi' ? type.nameHi : type.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="map-details__divider" />

          {/* Data Layers Section */}
          <div className="map-details__section">
            <div className="map-details__section-header">
              <span className="map-details__section-title">{t.dataLayersTitle}</span>
              <span className="map-details__section-subtitle">
                {lang === 'hi' ? 'सुदूर संवेदन ओपन डेटा स्रोत' : 'Public Telemetry Sources'}
              </span>
            </div>
            <div className="map-details__layer-list">
              {DATA_LAYERS.map((layer) => {
                const isActive = activeOverlays.includes(layer.id);
                return (
                  <button
                    key={layer.id}
                    className={`map-details__layer-row${isActive ? ' map-details__layer-row--active' : ''}`}
                    onClick={() => onToggleOverlay(layer)}
                    id={`data-layer-${layer.id}`}
                    type="button"
                  >
                    <span className="map-details__layer-icon">{layer.icon}</span>
                    <span className="map-details__layer-body">
                      <span className="map-details__layer-name">
                        {lang === 'hi' ? layer.nameHi : layer.name}
                      </span>
                      <span className="map-details__layer-desc">
                        {lang === 'hi' ? layer.descHi : layer.description}
                      </span>
                    </span>
                    <span className={`map-details__layer-toggle${isActive ? ' map-details__layer-toggle--active' : ''}`}>
                      <span className="map-details__layer-toggle-dot" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Official Attribution */}
          <div className="map-details__attribution">
            {t.openSourcesAttribution}
          </div>
        </div>
      )}
    </div>
  );
}
