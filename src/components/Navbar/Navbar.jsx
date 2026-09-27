import React from 'react';
import './Navbar.css';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Official GIS Navigation Bar with data layer controls and language switch.
 *
 * @param {{ layers: Record<string, boolean>, onToggleLayer: (key: string) => void }} props
 */
export default function Navbar({ layers, onToggleLayer }) {
  const { lang, setLang, t } = useLanguage();

  const layerButtons = [
    { key: 'vegetation', label: t.vegLayer, icon: '🌿' },
    { key: 'water',      label: t.waterLayer,      icon: '💧' },
    { key: 'landuse',    label: t.landuseLayer,    icon: '🏗️' },
  ];

  return (
    <nav className="navbar" id="navbar">
      {/* ---- Official Brand Identity ---- */}
      <div className="navbar__brand">
        <div className="navbar__flag-dot" aria-hidden="true" />
        <div>
          <h2 className="navbar__title">{t.portalName}</h2>
          <span className="navbar__subtitle">{t.portalTagline}</span>
        </div>
      </div>

      {/* ---- GIS Layer Toggle Buttons ---- */}
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
              title={label}
              type="button"
            >
              <span className="layer-btn__dot" />
              <span>{icon} {label}</span>
            </button>
          );
        })}
      </div>

      {/* ---- Language Switcher + Status ---- */}
      <div className="navbar__right">
        <div className="navbar__lang-switch">
          <button
            type="button"
            className={`navbar__lang-btn ${lang === 'en' ? 'navbar__lang-btn--active' : ''}`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
          <span className="navbar__lang-divider">|</span>
          <button
            type="button"
            className={`navbar__lang-btn ${lang === 'hi' ? 'navbar__lang-btn--active' : ''}`}
            onClick={() => setLang('hi')}
          >
            हिंदी
          </button>
        </div>

        <div className="navbar__status">
          <span className="navbar__status-dot" />
          <span>{t.systemLive}</span>
        </div>
      </div>
    </nav>
  );
}
