import { useState, useRef, useEffect } from 'react';
import './LayerControls.css';
import { locations } from '../../data/locations';

/**
 * Floating control panel on the map with a location switcher and toggle switches
 * for each data layer. Opens on click to avoid permanently blocking the map or detail panels.
 *
 * @param {{
 *   layers: Record<string, boolean>,
 *   onToggleLayer: (key: string) => void,
 *   activeLocationId: string,
 *   onLocationChange: (id: string) => void,
 * }} props
 */
export default function LayerControls({
  layers,
  onToggleLayer,
  activeLocationId,
  onLocationChange,
  isPanelOpen = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const layerDefs = [
    { key: 'vegetation', label: 'Vegetation (NDVI)', icon: '🌿' },
    { key: 'water',      label: 'Water (NDWI)',      icon: '💧' },
    { key: 'landuse',    label: 'Land Use / Cover',   icon: '🏗️' },
  ];

  const pilotLocations = locations.filter((l) => l.type === 'pilot');
  const referenceLocations = locations.filter((l) => l.type === 'reference');
  const activeLoc = locations.find((l) => l.id === activeLocationId) || locations[0];

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLocation = (id) => {
    onLocationChange(id);
    setIsOpen(false);
  };

  return (
    <div
      className={`layer-controls${isPanelOpen ? ' layer-controls--panel-open' : ''}`}
      id="layer-controls-panel"
      ref={containerRef}
    >
      {/* ---- Collapsible Trigger Button ---- */}
      <button
        className={`layer-controls__trigger${isOpen ? ' layer-controls__trigger--active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        id="location-switcher-btn"
        title="Change location and layers"
      >
        <span className="layer-controls__trigger-icon">📍</span>
        <span className="layer-controls__trigger-body">
          <span className="layer-controls__trigger-prefix">Location</span>
          <span className="layer-controls__trigger-name">{activeLoc ? activeLoc.name : 'Select Location'}</span>
        </span>
        <span className={`layer-controls__trigger-arrow${isOpen ? ' layer-controls__trigger-arrow--open' : ''}`}>
          ▾
        </span>
      </button>

      {/* ---- Popover Panel ---- */}
      {isOpen && (
        <div className="layer-controls__panel" id="location-switcher-panel">
          {/* ---- Location Switcher Header ---- */}
          <div className="location-section" id="location-switcher">
            <div className="layer-controls__header">
              <div className="layer-controls__header-left">
                <span className="layer-controls__header-icon">📍</span>
                <span className="layer-controls__title">Locations</span>
              </div>
              <button
                className="layer-controls__close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close location menu"
                id="layer-controls-close-btn"
              >
                ✕
              </button>
            </div>

          {/* Pilot Site Group */}
          <span className="location-section__group-label">Pilot Site</span>
          {pilotLocations.map((loc) => {
            const isActive = loc.id === activeLocationId;
            return (
              <div
                key={loc.id}
                className={`location-row${isActive ? ' location-row--active' : ''}`}
                onClick={() => handleSelectLocation(loc.id)}
                role="radio"
                aria-checked={isActive}
                id={`location-row-${loc.id}`}
              >
                <span className={`location-row__radio${isActive ? ' location-row__radio--active' : ''}`} />
                <span className="location-row__name">{loc.name}</span>
              </div>
            );
          })}

          {/* Reference Cases Group */}
          <span className="location-section__group-label">Reference Cases</span>
          {referenceLocations.map((loc) => {
            const isActive = loc.id === activeLocationId;
            return (
              <div
                key={loc.id}
                className={`location-row${isActive ? ' location-row--active' : ''}`}
                onClick={() => handleSelectLocation(loc.id)}
                role="radio"
                aria-checked={isActive}
                id={`location-row-${loc.id}`}
              >
                <span className={`location-row__radio${isActive ? ' location-row__radio--active' : ''}`} />
                <span className="location-row__name">{loc.name}</span>
              </div>
            );
          })}
        </div>

        <div className="layer-controls__divider" />

        {/* ---- Data Layers ---- */}
        <div className="layer-controls__header">
          <span className="layer-controls__header-icon">📡</span>
          <span className="layer-controls__title">Data Layers</span>
        </div>

        {/* Layer Rows */}
        {layerDefs.map(({ key, label, icon }) => {
          const isActive = !!layers[key];
          return (
            <div
              key={key}
              data-layer={key}
              className={`layer-row${isActive ? ' layer-row--active' : ''}`}
              onClick={() => onToggleLayer(key)}
              role="switch"
              aria-checked={isActive}
              id={`layer-row-${key}`}
            >
              {/* Toggle Switch */}
              <label className="layer-toggle" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggleLayer(key)}
                />
                <span className="layer-toggle__track" />
              </label>

              <span className="layer-row__icon">{icon}</span>
              <span className="layer-row__label">{label}</span>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

