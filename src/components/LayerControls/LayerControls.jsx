import './LayerControls.css';

/**
 * Floating panel on the map with toggle switches for each data layer.
 * Mirrors the state held in <App /> and provides a secondary control surface
 * (the primary controls are in the Navbar buttons).
 *
 * @param {{ layers: Record<string, boolean>, onToggleLayer: (key: string) => void }} props
 */
export default function LayerControls({ layers, onToggleLayer }) {
  const layerDefs = [
    { key: 'vegetation', label: 'Vegetation (NDVI)', icon: '🌿' },
    { key: 'water',      label: 'Water (NDWI)',      icon: '💧' },
    { key: 'landuse',    label: 'Land Use / Cover',   icon: '🏗️' },
  ];

  return (
    <div className="layer-controls" id="layer-controls-panel">
      <div className="layer-controls__panel">
        {/* Header */}
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
