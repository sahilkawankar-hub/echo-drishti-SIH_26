import { useState } from 'react';
import './DashboardOverview.css';

/**
 * Dashboard Overview component modeled directly on the reference design.
 *
 * @param {{
 *   onNavigateToMap: (siteId?: string) => void,
 * }} props
 */
export default function DashboardOverview({ onNavigateToMap }) {
  const [lang, setLang] = useState('EN');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);
  const [assignedTeams, setAssignedTeams] = useState({});

  const handleReAnalyze = () => {
    setIsAnalyzing(true);
    setAnalyzedSuccess(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedSuccess(true);
      setTimeout(() => setAnalyzedSuccess(false), 3000);
    }, 1200);
  };

  const handleAssignTeam = (id) => {
    setAssignedTeams((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="dashboard-container" id="dashboard-overview">
      {/* Top Header Bar */}
      <header className="dash-topbar">
        <div className="dash-topbar__brand">
          <div className="dash-topbar__icon">💧</div>
          <div>
            <div className="dash-topbar__title-row">
              <span className="dash-topbar__title">WATERSHED MONITOR</span>
              <span className="dash-topbar__tag">PILOT BASIN</span>
            </div>
            <span className="dash-topbar__subtitle">
              National Remote Sensing & Hydro Audit System
            </span>
          </div>
        </div>

        <div className="dash-topbar__actions">
          <div className="dash-lang-selector">
            <button
              className={`dash-lang-btn ${lang === 'EN' ? 'dash-lang-btn--active' : ''}`}
              onClick={() => setLang('EN')}
              type="button"
            >
              EN
            </button>
            <span className="dash-lang-divider">|</span>
            <button
              className={`dash-lang-btn ${lang === 'HI' ? 'dash-lang-btn--active' : ''}`}
              onClick={() => setLang('HI')}
              type="button"
            >
              हिंदी
            </button>
          </div>

          <div className="dash-profile">
            <div className="dash-profile__avatar">RS</div>
            <div className="dash-profile__info">
              <span className="dash-profile__name">Eng. Rajesh Sharma</span>
              <span className="dash-profile__role">Executive Engineer (Hydro)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Block Catchment Subheading & Actions */}
      <section className="dash-subbar">
        <div>
          <span className="dash-subbar__meta">
            BLOCK CATCHMENT INTELLIGENCE • Chandur & Kotra Tehsils
          </span>
          <h2 className="dash-subbar__heading">
            Watershed Health & Verification Summary
          </h2>
        </div>

        <div className="dash-subbar__controls">
          <div className="dash-sync-badge">
            <span className="dash-sync-badge__icon">🛰️</span>
            <span>Sentinel-2 Sync: Today, 08:30 AM</span>
          </div>

          <button
            className={`dash-btn-action ${isAnalyzing ? 'dash-btn-action--loading' : ''}`}
            onClick={handleReAnalyze}
            disabled={isAnalyzing}
            type="button"
          >
            <span className={`dash-spin ${isAnalyzing ? 'dash-spin--active' : ''}`}>🔄</span>
            <span>{isAnalyzing ? 'Analyzing Bands…' : analyzedSuccess ? 'Region Updated!' : 'Re-Analyze Region'}</span>
          </button>
        </div>
      </section>

      {/* 4 Summary Stat Cards */}
      <section className="dash-stats-grid">
        {/* Card 1: Water Structures */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">WATER STRUCTURES</span>
            <span className="dash-card__icon-box">🏛️</span>
          </div>
          <div className="dash-card__value-row">
            <span className="dash-card__big-val">52</span>
            <span className="dash-card__pill dash-card__pill--light">Structures Built</span>
          </div>
          {/* Segmented Multi-color progress */}
          <div className="dash-progress-segmented">
            <div className="dash-progress-seg dash-progress-seg--green" style={{ width: '85%' }} />
            <div className="dash-progress-seg dash-progress-seg--yellow" style={{ width: '10%' }} />
            <div className="dash-progress-seg dash-progress-seg--red" style={{ width: '5%' }} />
          </div>
          <div className="dash-card__breakdown">
            <span><span className="dot dot--green" /> 48 Verified</span>
            <span><span className="dot dot--yellow" /> 3 Review Due</span>
            <span><span className="dot dot--red" /> 1 Alert</span>
          </div>
        </div>

        {/* Card 2: Stored Water Volume */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">STORED WATER VOLUME</span>
            <span className="dash-card__icon-box">🌊</span>
          </div>
          <div className="dash-card__value-row">
            <span className="dash-card__big-val">18.2</span>
            <span className="dash-card__unit">Million Litres ML</span>
          </div>
          <div className="dash-card__tags">
            <span className="dash-pill-green">
              <span className="dash-arrow-up">↗</span> +42% vs last monsoon
            </span>
            <span className="dash-pill-neutral">HEALTHY RETENTION</span>
          </div>
        </div>

        {/* Card 3: Farmland Greening */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">FARMLAND GREENING</span>
            <span className="dash-card__icon-box">🌱</span>
          </div>
          <div className="dash-card__value-row">
            <span className="dash-card__big-val dash-card__big-val--green">+34%</span>
            <span className="dash-card__unit">Vegetation index</span>
          </div>
          <div className="dash-card__sub-details">
            <span>340 ha farm fields revived</span>
            <span className="dash-tag-small">Post-Rain NDVI</span>
          </div>
        </div>

        {/* Card 4: Fund Disbursals */}
        <div className="dash-card">
          <div className="dash-card__header">
            <span className="dash-card__title">FUND DISBURSALS</span>
            <span className="dash-card__icon-box">💳</span>
          </div>
          <div className="dash-card__value-row">
            <span className="dash-card__big-val">92%</span>
            <span className="dash-card__pill dash-card__pill--light">Cleared</span>
          </div>
          <div className="dash-card__sub-details">
            <span><strong>₹28.4 Lakhs</strong> paid</span>
            <span className="dash-tag-amber">₹2.8L under sign-off</span>
          </div>
        </div>
      </section>

      {/* Two Column Section: Alerts Queue & Panchayat Storage */}
      <section className="dash-content-grid">
        {/* Left Column: Recent Field Verification & Sensor Alerts */}
        <div className="dash-panel dash-panel--alerts">
          <div className="dash-panel__header">
            <div className="dash-panel__title-wrap">
              <span className="dash-panel__icon">📡</span>
              <h3 className="dash-panel__title">Recent Field Verification & Sensor Alerts</h3>
            </div>
            <button
              className="dash-link-btn"
              onClick={() => onNavigateToMap()}
              type="button"
            >
              View Queue (3) →
            </button>
          </div>

          <div className="dash-alerts-list">
            {/* Alert Item 1 */}
            <div
              className="dash-alert-item dash-alert-item--verified"
              onClick={() => onNavigateToMap('site-001')}
              role="button"
              tabIndex={0}
            >
              <div className="dash-alert-item__icon dash-alert-item__icon--green">✓</div>
              <div className="dash-alert-item__body">
                <div className="dash-alert-item__top">
                  <span className="dash-alert-item__name">Check Dam #07A</span>
                  <span className="dash-badge-status dash-badge-status--green">Verified Active</span>
                  <span className="dash-alert-item__time">35 min ago</span>
                </div>
                <div className="dash-alert-item__desc">
                  Kolyari Village • Impoundment depth 2.4m verified by GIS satellite survey
                </div>
              </div>
            </div>

            {/* Alert Item 2 */}
            <div
              className="dash-alert-item"
              onClick={() => onNavigateToMap('site-004')}
              role="button"
              tabIndex={0}
            >
              <div className="dash-alert-item__icon dash-alert-item__icon--cyan">〰</div>
              <div className="dash-alert-item__body">
                <div className="dash-alert-item__top">
                  <span className="dash-alert-item__name">Masonry Anicut #03</span>
                  <span className="dash-badge-status dash-badge-status--cyan">Water Stored Normal</span>
                  <span className="dash-alert-item__time">2 hrs ago</span>
                </div>
                <div className="dash-alert-item__desc">
                  Bakarol South • Flow capacity stable, minor percolation recorded
                </div>
              </div>
            </div>

            {/* Alert Item 3 */}
            <div
              className="dash-alert-item"
              onClick={() => onNavigateToMap('site-003')}
              role="button"
              tabIndex={0}
            >
              <div className="dash-alert-item__icon dash-alert-item__icon--amber">📅</div>
              <div className="dash-alert-item__body">
                <div className="dash-alert-item__top">
                  <span className="dash-alert-item__name">Community Farm Pond #12</span>
                  <span className="dash-badge-status dash-badge-status--amber">Visit Scheduled</span>
                  <span className="dash-alert-item__time">Tomorrow 10 AM</span>
                </div>
                <div className="dash-alert-item__desc">
                  Mamer Hamlet • Physical geotag confirmation assigned to field surveyor
                </div>
              </div>
            </div>

            {/* Alert Item 4 */}
            <div className="dash-alert-item dash-alert-item--alert">
              <div className="dash-alert-item__icon dash-alert-item__icon--red">⚠️</div>
              <div className="dash-alert-item__body">
                <div className="dash-alert-item__top">
                  <span className="dash-alert-item__name">Gully Plug Block #09</span>
                  <span className="dash-badge-status dash-badge-status--red">Desilt Required</span>
                </div>
                <div className="dash-alert-item__desc">
                  Malviya Nala • Silt build-up &gt;35%, release valve restricted
                </div>
              </div>
              <button
                className={`dash-btn-danger ${assignedTeams['gully-09'] ? 'dash-btn-danger--assigned' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAssignTeam('gully-09');
                }}
                type="button"
              >
                {assignedTeams['gully-09'] ? 'Team Dispatched' : 'Assign Team'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Panchayat Storage Health */}
        <div className="dash-panel dash-panel--panchayat">
          <div className="dash-panel__header">
            <div className="dash-panel__title-wrap">
              <span className="dash-panel__icon">📊</span>
              <div>
                <h3 className="dash-panel__title">Panchayat Storage Health</h3>
                <span className="dash-panel__meta">4 Gram Panchayats</span>
              </div>
            </div>
          </div>

          <div className="dash-storage-list">
            {/* Panchayat 1 */}
            <div className="dash-storage-item">
              <div className="dash-storage-item__header">
                <span className="dash-storage-item__name">Kolyari <span className="dash-storage-item__count">14 Structures</span></span>
                <span className="dash-storage-item__pct dash-storage-item__pct--green">98% Stored</span>
              </div>
              <div className="dash-storage-item__bar">
                <div className="dash-storage-item__fill dash-storage-item__fill--green" style={{ width: '98%' }} />
              </div>
            </div>

            {/* Panchayat 2 */}
            <div className="dash-storage-item">
              <div className="dash-storage-item__header">
                <span className="dash-storage-item__name">Bakarol <span className="dash-storage-item__count">16 Structures</span></span>
                <span className="dash-storage-item__pct dash-storage-item__pct--green">92% Stored</span>
              </div>
              <div className="dash-storage-item__bar">
                <div className="dash-storage-item__fill dash-storage-item__fill--green" style={{ width: '92%' }} />
              </div>
            </div>

            {/* Panchayat 3 */}
            <div className="dash-storage-item">
              <div className="dash-storage-item__header">
                <span className="dash-storage-item__name">Malviya <span className="dash-storage-item__count">11 Structures</span></span>
                <span className="dash-storage-item__pct dash-storage-item__pct--teal">84% Stored</span>
              </div>
              <div className="dash-storage-item__bar">
                <div className="dash-storage-item__fill dash-storage-item__fill--teal" style={{ width: '84%' }} />
              </div>
            </div>

            {/* Panchayat 4 */}
            <div className="dash-storage-item">
              <div className="dash-storage-item__header">
                <span className="dash-storage-item__name">Mamer <span className="dash-storage-item__count">11 Structures</span></span>
                <span className="dash-storage-item__pct dash-storage-item__pct--amber">78% (Desilt Needed)</span>
              </div>
              <div className="dash-storage-item__bar">
                <div className="dash-storage-item__fill dash-storage-item__fill--amber" style={{ width: '78%' }} />
              </div>
            </div>
          </div>

          <div className="dash-storage-footer">
            <span className="dash-storage-footer__target">Target: 75% Impoundment Rate</span>
            <span className="dash-pill-goal">✓ All Surpassing Goal</span>
          </div>
        </div>
      </section>

      {/* Bottom Action Footer Bar */}
      <footer className="dash-action-bar">
        <div className="dash-action-bar__left">
          <div className="dash-action-bar__icon">⚡</div>
          <span className="dash-action-bar__text">
            <strong>Fast Dispatch Mode:</strong> Ready for pending structural verifications and subsidy release batches.
          </span>
        </div>

        <div className="dash-action-bar__buttons">
          <button className="dash-btn-secondary" type="button" onClick={() => alert('Exporting Block Catchment Summary PDF...')}>
            📥 Download Block Summary
          </button>
          <button className="dash-btn-secondary" type="button" onClick={handleReAnalyze}>
            🛰️ Sync Satellite Feed (2h ago)
          </button>
          <button
            className="dash-btn-primary"
            type="button"
            onClick={() => onNavigateToMap('site-001')}
          >
            📋 Review Next 3 Verifications
          </button>
        </div>
      </footer>
    </div>
  );
}
