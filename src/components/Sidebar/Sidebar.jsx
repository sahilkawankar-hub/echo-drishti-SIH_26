import './Sidebar.css';

/**
 * Sidebar navigation component modeled on the reference design.
 *
 * @param {{
 *   activeView: 'overview' | 'map' | 'queue' | 'reports',
 *   onSelectView: (view: string) => void,
 * }} props
 */
export default function Sidebar({ activeView, onSelectView }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'map', label: 'Map View & GIS', icon: '🗺️' },
    { id: 'queue', label: 'Verification Queue', icon: '📋', badge: '3' },
    { id: 'reports', label: 'Disbursements & Reports', icon: '💳' },
  ];

  return (
    <aside className="portal-sidebar" id="portal-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand__left">
          <div className="sidebar-brand__dot-wrap">
            <span className="sidebar-brand__dot" />
          </div>
          <div>
            <div className="sidebar-brand__title">WATERSHED</div>
            <div className="sidebar-brand__title">PORTAL</div>
          </div>
        </div>
        <div className="sidebar-brand__badge">
          <span className="sidebar-brand__live-tag">LIVE</span>
          <span className="sidebar-brand__version">v2.4</span>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="sidebar-section">
        <div className="sidebar-section__label">NAVIGATION</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                className={`sidebar-nav__item ${isActive ? 'sidebar-nav__item--active' : ''}`}
                onClick={() => onSelectView(item.id)}
                type="button"
              >
                {isActive && <span className="sidebar-nav__indicator" />}
                <span className="sidebar-nav__icon">{item.icon}</span>
                <span className="sidebar-nav__text">{item.label}</span>
                {item.badge && (
                  <span className="sidebar-nav__badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick stats spacer */}
      <div className="sidebar-spacer" />

      {/* Node Uplink telemetry footer */}
      <div className="sidebar-telemetry">
        <div className="sidebar-telemetry__header">
          <span className="sidebar-telemetry__label">NODE UPLINK</span>
          <span className="sidebar-telemetry__val">
            <span className="sidebar-telemetry__dot" /> 99.8%
          </span>
        </div>
        <div className="sidebar-telemetry__bar">
          <div className="sidebar-telemetry__fill" style={{ width: '99.8%' }} />
        </div>
        <div className="sidebar-telemetry__footer">
          <span>Synced: 1m ago</span>
          <span className="sidebar-telemetry__status">GIS Core Online</span>
        </div>
      </div>
    </aside>
  );
}
