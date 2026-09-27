import React from 'react';
import './Sidebar.css';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Institutional Geospatial Portal Sidebar Navigation
 *
 * @param {{
 *   activeView: 'overview' | 'map' | 'queue' | 'reports' | 'login',
 *   onSelectView: (view: string) => void,
 * }} props
 */
export default function Sidebar({ activeView, onSelectView }) {
  const { lang, t } = useLanguage();
  const { isOfficer } = useAuth();

  const navItems = [
    {
      id: 'overview',
      label: t.navOverview,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ),
    },
    {
      id: 'map',
      label: t.navMap,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" x2="9" y1="3" y2="18" />
          <line x1="15" x2="15" y1="6" y2="21" />
        </svg>
      ),
    },
    {
      id: 'queue',
      label: t.navQueue,
      badge: '3',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'login',
      label: t.navLogin,
      badge: isOfficer ? 'OFFICER' : 'PUBLIC',
      badgeColor: isOfficer ? '#10b981' : '#38bdf8',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="portal-sidebar" id="portal-sidebar">
      {/* Institutional Branding Header with eco_drishti Logo */}
      <div className="sidebar-brand">
        <div className="sidebar-brand__header">
          <div className="sidebar-brand__accent-bar" aria-hidden="true" />
          <div className="sidebar-brand__identity-row">
            <div className="sidebar-brand__logo-wrap">
              <img
                src="/eco_drishti_logo.png"
                alt="eco_drishti"
                className="sidebar-brand__logo"
              />
            </div>
            <div className="sidebar-brand__title-box">
              <div className="sidebar-brand__dept-tag" style={{ color: '#34d399', letterSpacing: '0.04em' }}>
                eco_drishti
              </div>
              <div className="sidebar-brand__main-title">
                {lang === 'hi' ? 'जलसंभर निगरानी' : 'WATERSHED'}
              </div>
              <div className="sidebar-brand__sub-title">
                {lang === 'hi' ? 'भू-स्थानिक पोर्टल' : 'PORTAL'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="sidebar-section">
        <div className="sidebar-section__label">{t.navTitle}</div>
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
                  <span
                    className="sidebar-nav__badge"
                    style={item.badgeColor ? { color: item.badgeColor, borderColor: item.badgeColor } : {}}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-spacer" />

      {/* Satellite Geoportal Status Footer */}
      <div className="sidebar-telemetry">
        <div className="sidebar-telemetry__header">
          <span className="sidebar-telemetry__label">SATELLITE GEODOWNLINK</span>
          <span className="sidebar-telemetry__val">
            <span className="sidebar-telemetry__dot" /> 100%
          </span>
        </div>
        <div className="sidebar-telemetry__bar">
          <div className="sidebar-telemetry__fill" style={{ width: '100%' }} />
        </div>
        <div className="sidebar-telemetry__footer">
          <span>{lang === 'hi' ? 'सेंटिनल-2 लिंक: सक्रिय' : 'Sentinel-2 Link: Active'}</span>
          <span className="sidebar-telemetry__status">
            {isOfficer ? (lang === 'hi' ? 'अधिकारी मोड' : 'Officer Mode') : (lang === 'hi' ? 'नागरिक मोड' : 'Public Mode')}
          </span>
        </div>
      </div>
    </aside>
  );
}
