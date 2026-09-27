import { useState, useRef, useEffect } from 'react';
import './LayerControls.css';
import { locations } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';

/**
 * LayerControls — Official GIS layer switch and reference study basin selector.
 *
 * @param {{
 *   layers: Record<string, boolean>,
 *   onToggleLayer: (key: string) => void,
 *   activeLocationId: string,
 *   onLocationChange: (id: string) => void,
 *   isPanelOpen?: boolean,
 * }} props
 */
export default function LayerControls({
  layers,
  onToggleLayer,
  activeLocationId,
  onLocationChange,
  isPanelOpen = false,
}) {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const layerDefs = [
    { key: 'vegetation', label: t.vegLayer, icon: '🌿' },
    { key: 'water',      label: t.waterLayer,      icon: '💧' },
    { key: 'landuse',    label: t.landuseLayer,    icon: '🏗️' },
  ];

  const pilotLocations = locations.filter((l) => l.type === 'pilot');
  const referenceLocations = locations.filter((l) => l.type === 'reference');
  const activeLoc = locations.find((l) => l.id === activeLocationId) || locations[0];

  const getLocationDisplayName = (loc) => {
    if (!loc) return '';
    if (lang === 'hi') {
      if (loc.id === 'chandur-railway') return 'चांदुर रेलवे (अमरावती)';
      if (loc.id === 'hiware-bazar') return 'हिवरे बाजार (अहमदनगर)';
      if (loc.id === 'ralegan-siddhi') return 'रालेगण सिद्धि (अहमदनगर)';
    }
    return loc.name;
  };

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
      {/* ---- Clear Official Trigger Button (Explicitly labeled as Base Study Basin) ---- */}
      <button
        className={`layer-controls__trigger${isOpen ? ' layer-controls__trigger--active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        id="location-switcher-btn"
        title={t.pilotBasinLabel}
        type="button"
      >
        <span className="layer-controls__trigger-icon" aria-hidden="true">🏛️</span>
        <span className="layer-controls__trigger-body">
          <span className="layer-controls__trigger-prefix">{t.pilotBasinPrefix}</span>
          <span className="layer-controls__trigger-name">
            {getLocationDisplayName(activeLoc)}
          </span>
        </span>
        <span className={`layer-controls__trigger-arrow${isOpen ? ' layer-controls__trigger-arrow--open' : ''}`}>
          ▾
        </span>
      </button>

      {/* ---- Official Popover Panel ---- */}
      {isOpen && (
        <div className="layer-controls__panel" id="location-switcher-panel">
          {/* Header */}
          <div className="location-section" id="location-switcher">
            <div className="layer-controls__header">
              <div className="layer-controls__header-left">
                <span className="layer-controls__header-icon">🗺️</span>
                <span className="layer-controls__title">{t.pilotBasinLabel}</span>
              </div>
              <button
                className="layer-controls__close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                id="layer-controls-close-btn"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Pilot Site Group */}
            <span className="location-section__group-label">{t.pilotOptionLabel}</span>
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
                  <span className="location-row__name">{getLocationDisplayName(loc)}</span>
                </div>
              );
            })}

            {/* Reference Cases Group */}
            <span className="location-section__group-label">{t.refOptionLabel}</span>
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
                  <span className="location-row__name">{getLocationDisplayName(loc)}</span>
                </div>
              );
            })}
          </div>

          <div className="layer-controls__divider" />

          {/* ---- Data Layers ---- */}
          <div className="layer-controls__header">
            <span className="layer-controls__header-icon">📡</span>
            <span className="layer-controls__title">{t.dataLayersTitle}</span>
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
