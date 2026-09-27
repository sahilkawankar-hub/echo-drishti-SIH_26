import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

/**
 * Dedicated Institutional Authentication Page (LoginPage)
 * Features two distinct access tiers:
 * 1. Department Officer (Full administrative & editing privilege for map & dashboard)
 * 2. Public Citizen (View-only public exploratory access)
 *
 * @param {{ onBackToPortal: () => void }} props
 */
export default function LoginPage({ onBackToPortal }) {
  const { lang, setLang, t } = useLanguage();
  const { loginAsOfficer, loginAsPublic, currentUser } = useAuth();

  // Active Login Tab: 'officer' | 'public'
  const [activeTab, setActiveTab] = useState(currentUser?.role === 'public' ? 'public' : 'officer');

  // Officer form state
  const [officerId, setOfficerId] = useState('OFF-4921');
  const [officerEmail, setOfficerEmail] = useState('r.sharma@hydro-gis.org');
  const [officerPin, setOfficerPin] = useState('••••••');
  const [officerDivision, setOfficerDivision] = useState('Chandur Railway Hydro-Audit Circle, Amravati');

  // Public citizen form state
  const [citizenName, setCitizenName] = useState('Alok Verma');
  const [citizenMobile, setCitizenMobile] = useState('+91 98765 43210');
  const [citizenPurpose, setCitizenPurpose] = useState('Water Conservation Research');

  const [notification, setNotification] = useState(null);

  const handleOfficerLogin = (e) => {
    e.preventDefault();
    loginAsOfficer({
      id: officerId,
      email: officerEmail,
      name: 'Er. Rajesh Sharma',
      designation: 'Executive Engineer (Hydro-GIS)',
      department: officerDivision,
    });
    setNotification({
      type: 'success',
      text: lang === 'hi' ? 'अधिकारी लॉगिन सफल! पूर्ण संपादन अधिकार सक्रिय।' : 'Officer Authentication Verified! Full edit permissions granted.',
    });
    setTimeout(() => {
      onBackToPortal();
    }, 900);
  };

  const handlePublicLogin = (e) => {
    e.preventDefault();
    loginAsPublic({
      name: citizenName || 'Citizen User',
      email: citizenMobile,
      department: citizenPurpose,
    });
    setNotification({
      type: 'info',
      text: lang === 'hi' ? 'सार्वजनिक नागरिक पहुंच सक्रिय! केवल अवलोकन मोड।' : 'Public Citizen Access Granted! Explorer view-only mode.',
    });
    setTimeout(() => {
      onBackToPortal();
    }, 900);
  };

  return (
    <div className="login-page-container" id="login-portal-page">
      {/* Top Bar with Return Navigation & Language Switch */}
      <div className="login-top-bar">
        <button
          type="button"
          className="login-back-btn"
          onClick={onBackToPortal}
          id="login-back-btn"
        >
          {t.loginPageBack}
        </button>

        <div className="login-lang-switch">
          <button
            type="button"
            className={`login-lang-btn ${lang === 'en' ? 'login-lang-btn--active' : ''}`}
            onClick={() => setLang('en')}
          >
            English
          </button>
          <span className="login-lang-divider">|</span>
          <button
            type="button"
            className={`login-lang-btn ${lang === 'hi' ? 'login-lang-btn--active' : ''}`}
            onClick={() => setLang('hi')}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Header */}
          <div className="login-card__header">
            <div className="login-card__icon-box">
              <img
                src="/eco_drishti_logo.png"
                alt="eco_drishti"
                className="login-card__logo-img"
              />
            </div>
            <h1 className="login-card__title">eco_drishti • {t.loginTitle}</h1>
            <p className="login-card__sub">{t.loginSub}</p>
          </div>

          {/* Feedback Notification Alert */}
          {notification && (
            <div className={`login-alert login-alert--${notification.type}`}>
              <span>{notification.type === 'success' ? '✓' : 'ℹ'}</span>
              <span>{notification.text}</span>
            </div>
          )}

          {/* Tab Selector: Officer Access vs Public Access */}
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab ${activeTab === 'officer' ? 'login-tab--active' : ''}`}
              onClick={() => setActiveTab('officer')}
              id="tab-officer-btn"
            >
              <span className="login-tab__icon">🛡️</span>
              <div className="login-tab__text">
                <span className="login-tab__title">{t.officerRoleLabel}</span>
                <span className="login-tab__badge">{t.editModeBadge}</span>
              </div>
            </button>

            <button
              type="button"
              className={`login-tab ${activeTab === 'public' ? 'login-tab--active' : ''}`}
              onClick={() => setActiveTab('public')}
              id="tab-public-btn"
            >
              <span className="login-tab__icon">🌐</span>
              <div className="login-tab__text">
                <span className="login-tab__title">{t.publicRoleLabel}</span>
                <span className="login-tab__badge login-tab__badge--view">{t.viewOnlyBadge}</span>
              </div>
            </button>
          </div>

          {/* Tier 1: Officer Login Form (Can edit map, dashboard, queue, disbursements) */}
          {activeTab === 'officer' && (
            <form className="login-form" onSubmit={handleOfficerLogin} id="officer-login-form">
              <div className="login-permission-banner login-permission-banner--officer">
                <span className="login-permission-icon">⚡</span>
                <span className="login-permission-text">
                  <strong>{lang === 'hi' ? 'अधिकारी विशेषाधिकार:' : 'Officer Privilege:'}</strong>{' '}
                  {t.officerDesc}
                </span>
              </div>

              <div className="login-form-group">
                <label className="login-label">
                  {lang === 'hi' ? 'अधिकारी पहचान पत्र संख्या (Officer ID)' : 'Department Officer ID'}
                </label>
                <input
                  type="text"
                  className="login-input"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. OFF-4921"
                  required
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">
                  {lang === 'hi' ? 'विभागीय ईमेल पता (Official Email)' : 'Official Department Email'}
                </label>
                <input
                  type="email"
                  className="login-input"
                  value={officerEmail}
                  onChange={(e) => setOfficerEmail(e.target.value)}
                  placeholder="name@hydro-gis.org"
                  required
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">
                  {lang === 'hi' ? 'प्रशासनिक क्षेत्राधिकार (Jurisdiction)' : 'Jurisdiction Circle / Division'}
                </label>
                <input
                  type="text"
                  className="login-input"
                  value={officerDivision}
                  onChange={(e) => setOfficerDivision(e.target.value)}
                  required
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">
                  {lang === 'hi' ? 'सुरक्षा पिन / पासवर्ड (Security PIN)' : 'Security PIN / Authorization Key'}
                </label>
                <input
                  type="password"
                  className="login-input"
                  value={officerPin}
                  onChange={(e) => setOfficerPin(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-submit-btn login-submit-btn--officer" id="submit-officer-login">
                🛡️ {t.loginBtnOfficer}
              </button>

              <div className="login-quick-demo">
                <span className="login-quick-label">{lang === 'hi' ? 'त्वरित डेमो परीक्षण:' : 'Quick Demo Test:'}</span>
                <button
                  type="button"
                  className="login-quick-btn"
                  onClick={() => {
                    setOfficerId('OFF-4921');
                    setOfficerEmail('r.sharma@hydro-gis.org');
                    setOfficerDivision('Chandur Railway Hydro-Audit Circle, Amravati');
                    loginAsOfficer();
                    onBackToPortal();
                  }}
                >
                  ⚡ 1-Click Fast Login (Er. Rajesh Sharma, Executive Engineer)
                </button>
              </div>
            </form>
          )}

          {/* Tier 2: Public Citizen Access Form (View only, cannot alter dashboard) */}
          {activeTab === 'public' && (
            <form className="login-form" onSubmit={handlePublicLogin} id="public-login-form">
              <div className="login-permission-banner login-permission-banner--public">
                <span className="login-permission-icon">👁️</span>
                <span className="login-permission-text">
                  <strong>{lang === 'hi' ? 'नागरिक अवलोकन अधिकार:' : 'Public Access Privilege:'}</strong>{' '}
                  {t.publicDesc}
                </span>
              </div>

              <div className="login-form-group">
                <label className="login-label">
                  {lang === 'hi' ? 'नागरिक / शोधकर्ता का नाम (Full Name)' : 'Citizen / Researcher Full Name'}
                </label>
                <input
                  type="text"
                  className="login-input"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">
                  {lang === 'hi' ? 'मोबाइल नंबर अथवा ईमेल (Mobile or Email)' : 'Contact Mobile / Email'}
                </label>
                <input
                  type="text"
                  className="login-input"
                  value={citizenMobile}
                  onChange={(e) => setCitizenMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="login-form-group">
                <label className="login-label">
                  {lang === 'hi' ? 'अवलोकन प्रयोजन (Purpose of Access)' : 'Access Purpose'}
                </label>
                <input
                  type="text"
                  className="login-input"
                  value={citizenPurpose}
                  onChange={(e) => setCitizenPurpose(e.target.value)}
                  placeholder="e.g. Catchment Study / Local Water Inspection"
                />
              </div>

              <button type="submit" className="login-submit-btn login-submit-btn--public" id="submit-public-login">
                🌐 {t.loginBtnPublic}
              </button>

              <div className="login-quick-demo">
                <span className="login-quick-label">{lang === 'hi' ? 'त्वरित डेमो परीक्षण:' : 'Quick Demo Test:'}</span>
                <button
                  type="button"
                  className="login-quick-btn login-quick-btn--public"
                  onClick={() => {
                    loginAsPublic();
                    onBackToPortal();
                  }}
                >
                  ⚡ 1-Click Fast Access (Citizen Explorer Mode)
                </button>
              </div>
            </form>
          )}

          {/* Access Comparison Matrix */}
          <div className="login-matrix">
            <div className="login-matrix__title">
              {lang === 'hi' ? 'प्राधिकार स्तर तुलना (Access Permissions Matrix)' : 'Authorization Tier Matrix'}
            </div>
            <div className="login-matrix__table">
              <div className="login-matrix__row login-matrix__row--head">
                <span>{lang === 'hi' ? 'प्रणाली कार्यक्षमता' : 'Portal Feature'}</span>
                <span>{lang === 'hi' ? 'अधिकारी' : 'Officer'}</span>
                <span>{lang === 'hi' ? 'सार्वजनिक' : 'Public'}</span>
              </div>
              <div className="login-matrix__row">
                <span>{lang === 'hi' ? 'जीआईएस उपग्रह मानचित्र व सीमा खोज' : 'Satellite Map & Boundary Search'}</span>
                <span className="check">✓</span>
                <span className="check">✓</span>
              </div>
              <div className="login-matrix__row">
                <span>{lang === 'hi' ? 'दूरी मापन व रिज़ॉल्यूशन निरीक्षण' : 'Distance Measure & Resolution'}</span>
                <span className="check">✓</span>
                <span className="check">✓</span>
              </div>
              <div className="login-matrix__row">
                <span>{lang === 'hi' ? 'डैशबोर्ड व जलसंभर लक्ष्य संपादन' : 'Edit Dashboard & Target Values'}</span>
                <span className="check">✓ {lang === 'hi' ? 'संपादन' : 'Editable'}</span>
                <span className="cross">✕ {lang === 'hi' ? 'केवल अवलोकन' : 'View Only'}</span>
              </div>
              <div className="login-matrix__row">
                <span>{lang === 'hi' ? 'क्षेत्र सत्यापन कतार स्वीकृति व कार्यदल' : 'Verify Queue & Task Force Assign'}</span>
                <span className="check">✓ {lang === 'hi' ? 'स्वीकृति' : 'Approve'}</span>
                <span className="cross">✕ {lang === 'hi' ? 'अस्वीकृत' : 'Locked'}</span>
              </div>
              <div className="login-matrix__row">
                <span>{lang === 'hi' ? 'संवितरण व वित्तीय अंकेक्षण रिपोर्ट' : 'Disbursements & Audit Sign-Off'}</span>
                <span className="check">✓ {lang === 'hi' ? 'हस्ताक्षर' : 'Sign-Off'}</span>
                <span className="cross">✕ {lang === 'hi' ? 'अस्वीकृत' : 'Locked'}</span>
              </div>
            </div>
          </div>

          <div className="login-footer-notice">
            🔒 {t.authNotice}
          </div>
        </div>
      </div>
    </div>
  );
}
