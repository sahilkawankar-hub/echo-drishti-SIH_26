import './LayerControls.css';
import { locations } from '../../data/locations';

/**
 * Floating panel on the map with a location switcher and toggle switches
 * for each data layer. The location switcher groups sites into
 * "Pilot Site" and "Reference Cases".
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
}) {
  const layerDefs = [
    { key: 'vegetation', label: 'Vegetation (NDVI)', icon: '🌿' },
    { key: 'water',      label: 'Water (NDWI)',      icon: '💧' },
    { key: 'landuse',    label: 'Land Use / Cover',   icon: '🏗️' },
  ];

  const pilotLocations = locations.filter((l) => l.type === 'pilot');
  const referenceLocations = locations.filter((l) => l.type === 'reference');

  return (
    <div className="layer-controls" id="layer-controls-panel">
      <div className="layer-controls__panel">

        {/* ---- Location Switcher ---- */}
        <div className="location-section" id="location-switcher">
          <div className="layer-controls__header">
            <span className="layer-controls__header-icon">📍</span>
            <span className="layer-controls__title">Locations</span>
          </div>

          {/* Pilot Site Group */}
          <span className="location-section__group-label">Pilot Site</span>
          {pilotLocations.map((loc) => {
            const isActive = loc.id === activeLocationId;
            return (
              <div
                key={loc.id}
                className={`location-row${isActive ? ' location-row--active' : ''}`}
                onClick={() => onLocationChange(loc.id)}
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
                onClick={() => onLocationChange(loc.id)}
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
    </div>
  );
}

