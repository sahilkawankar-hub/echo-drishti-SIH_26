import './Navbar.css';

/**
 * Top navigation bar with the dashboard title and layer toggle buttons.
 *
 * @param {{ layers: Record<string, boolean>, onToggleLayer: (key: string) => void }} props
 */
export default function Navbar({ layers, onToggleLayer }) {
  /** Human-friendly labels and accent-layer keys */
  const layerButtons = [
    { key: 'vegetation', label: 'Vegetation Layer', icon: '🌿' },
    { key: 'water',      label: 'Water Layer',      icon: '💧' },
    { key: 'landuse',    label: 'Land Use Layer',    icon: '🏗️' },
  ];

  return (
    <nav className="navbar" id="navbar">
      {/* ---- Brand ---- */}
      <div className="navbar__brand">
        <span className="navbar__icon" aria-hidden="true">🛰️</span>
        <div>
          <h1 className="navbar__title">Watershed Monitor</h1>
          <span className="navbar__subtitle">Satellite Intelligence Dashboard</span>
        </div>
      </div>

      {/* ---- Layer Toggle Buttons ---- */}
      <div className="navbar__controls" id="layer-controls">
        {layerButtons.map(({ key, label, icon }) => {
          const isActive = !!layers[key];
          return (
            <button
              key={key}
              id={`layer-btn-${key}`}
              data-layer={key}
              className={`layer-btn${isActive ? ' layer-btn--active' : ''}`}
              onClick={() => onToggleLayer(key)}
              aria-pressed={isActive}
              title={`Toggle ${label}`}
            >
              <span className="layer-btn__dot" />
              <span>{icon} {label}</span>
            </button>
          );
        })}
      </div>

      {/* ---- Status ---- */}
      <div className="navbar__status">
        <span className="navbar__status-dot" />
        <span>Live</span>
      </div>
    </nav>
  );
}
