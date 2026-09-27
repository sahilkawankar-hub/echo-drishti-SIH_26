import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import './GovHeader.css';

/**
 * Institutional Geospatial Portal Header (GovHeader)
 * Displays institutional Directorate branding, global language switch,
 * and user role/authentication bar with access to the dedicated Login Page.
 *
 * @param {{ onNavigateToLogin?: () => void }} props
 */
export default function GovHeader({ onNavigateToLogin }) {
  const { lang, setLang, t } = useLanguage();
  const { currentUser, isOfficer, isPublic, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  const handleOpenLogin = () => {
    setIsProfileOpen(false);
    onNavigateToLogin?.();
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
  };

  return (
    <div className="gov-header-wrapper" id="gov-portal-header">
      {/* Sleek Institutional Dual-Tone Border (No national flags/colors) */}
      <div className="gov-accent-border" aria-hidden="true" />

      <header className="gov-main-header">
        <div className="gov-identity-section">
          {/* eco_drishti Logo */}
          <div className="gov-emblem-badge" title="eco_drishti • Agriculture Foodtech & Development">
            <img
              src="/eco_drishti_logo.png"
              alt="eco_drishti logo"
              className="gov-emblem-img"
            />
          </div>

          <div className="gov-titles">
            <div className="gov-hierarchy">
              <span className="gov-subline gov-subline--bold" style={{ color: '#34d399', letterSpacing: '0.04em' }}>
                eco_drishti
              </span>
              <span className="gov-sep">•</span>
              <span className="gov-subline">
                {lang === 'hi' ? 'कृषि खाद्य तकनीक एवं सतत विकास' : 'Agriculture Foodtech & Watershed Development'}
              </span>
            </div>
            <div className="gov-portal-title-row">
              <h1 className="gov-portal-heading">{t.portalName}</h1>
              <span className="gov-pilot-tag">{t.pilotBadge}</span>
              <span className={`gov-role-status-chip ${isOfficer ? 'gov-role-status-chip--officer' : 'gov-role-status-chip--public'}`}>
                {isOfficer ? `● ${t.editModeBadge}` : `○ ${t.viewOnlyBadge}`}
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Controls: Bilingual Switcher + Profile / Login Bar */}
        <div className="gov-header-actions">
          {/* Functional Bilingual Language Selector */}
          <div className="gov-lang-switch-box" id="language-toggle-control">
            <span className="gov-lang-icon" aria-hidden="true">🌐</span>
            <button
              type="button"
              id="lang-btn-en"
              className={`gov-lang-btn ${lang === 'en' ? 'gov-lang-btn--active' : ''}`}
              onClick={() => setLang('en')}
              title="English"
            >
              EN
            </button>
            <span className="gov-lang-divider">|</span>
            <button
              type="button"
              id="lang-btn-hi"
              className={`gov-lang-btn ${lang === 'hi' ? 'gov-lang-btn--active' : ''}`}
              onClick={() => setLang('hi')}
              title="हिन्दी"
            >
              हिन्दी
            </button>
          </div>

          {/* Interactive Profile & Sign In Bar */}
          <div className="gov-auth-container" ref={profileMenuRef}>
            <button
              type="button"
              className={`gov-profile-trigger ${isProfileOpen ? 'gov-profile-trigger--open' : ''}`}
              onClick={() => setIsProfileOpen((prev) => !prev)}
              id="auth-profile-btn"
              title="Account Permissions & Sign In"
            >
              <div
                className="gov-official-avatar"
                style={{
                  background: isOfficer ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                  borderColor: isOfficer ? '#10b981' : '#38bdf8',
                  color: isOfficer ? '#34d399' : '#38bdf8',
                }}
              >
                {isOfficer ? 'RS' : 'GU'}
              </div>
              <div className="gov-official-details">
                <div className="gov-official-top-row">
                  <span className="gov-official-name">
                    {isOfficer ? currentUser.name : (lang === 'hi' ? 'नागरिक अतिथि' : 'Citizen Guest')}
                  </span>
                  <span className={`gov-role-mini-badge ${isOfficer ? 'gov-role-mini-badge--officer' : 'gov-role-mini-badge--public'}`}>
                    {isOfficer ? (lang === 'hi' ? 'अधिकारी' : 'OFFICER') : (lang === 'hi' ? 'सार्वजनिक' : 'PUBLIC')}
                  </span>
                </div>
                <span className="gov-official-role">
                  {isOfficer
                    ? (lang === 'hi' ? currentUser.designationHi : currentUser.designation)
                    : (lang === 'hi' ? 'सार्वजनिक अन्वेषक (अवलोकन)' : 'Public Explorer (View-only)')}
                </span>
              </div>
              <span className="gov-profile-caret">{isProfileOpen ? '▴' : '▾'}</span>
            </button>

            {/* Profile / Switch Role Popover Menu */}
            {isProfileOpen && (
              <div className="gov-profile-menu" id="auth-profile-menu">
                <div className="gov-profile-menu__header">
                  <span className="gov-profile-menu__title">{t.authNotice}</span>
                  <span className="gov-profile-menu__role-desc">
                    {isOfficer ? t.permissionOfficerActive : t.permissionPublicActive}
                  </span>
                </div>

                <div className="gov-profile-menu__roles-box">
                  {/* Officer Option */}
                  <div className={`gov-role-card ${isOfficer ? 'gov-role-card--active' : ''}`}>
                    <div className="gov-role-card__left">
                      <span className="gov-role-card__icon">🛡️</span>
                      <div>
                        <div className="gov-role-card__title">{t.officerRoleLabel}</div>
                        <div className="gov-role-card__sub">{t.officerDesc}</div>
                      </div>
                    </div>
                    {isOfficer && <span className="gov-role-card__badge">CURRENT</span>}
                  </div>

                  {/* Public Option */}
                  <div className={`gov-role-card ${isPublic ? 'gov-role-card--active' : ''}`}>
                    <div className="gov-role-card__left">
                      <span className="gov-role-card__icon">🌐</span>
                      <div>
                        <div className="gov-role-card__title">{t.publicRoleLabel}</div>
                        <div className="gov-role-card__sub">{t.publicDesc}</div>
                      </div>
                    </div>
                    {isPublic && <span className="gov-role-card__badge">CURRENT</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="gov-profile-menu__actions">
                  <button
                    type="button"
                    className="gov-profile-menu__btn gov-profile-menu__btn--primary"
                    onClick={handleOpenLogin}
                    id="goto-login-page-btn"
                  >
                    🔑 {t.switchRole}
                  </button>

                  <button
                    type="button"
                    className="gov-profile-menu__btn gov-profile-menu__btn--secondary"
                    onClick={handleLogout}
                    id="signout-btn"
                  >
                    🚪 {t.signOut}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
