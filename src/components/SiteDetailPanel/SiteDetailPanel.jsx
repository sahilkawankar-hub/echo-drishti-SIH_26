import { useState, useCallback, useEffect } from 'react';
import ReportResult from '../ReportResult/ReportResult';
import { generateVerificationReport } from '../../utils/ndviCompare';
import { locations } from '../../data/locations';
import ndviBeforeImg from '../../assets/ndvi_before_2025-12-01.png';
import ndviAfterImg from '../../assets/ndvi_after_2026-06-04.png';
import './SiteDetailPanel.css';

/**
 * Side panel that shows a detailed view for a selected saved site.
 * Displays the saved completion photo alongside real Sentinel-2 NDVI imagery,
 * and a "Generate Report" button that produces a deterministic NDVI comparison result.
 *
 * @param {{ site: object, activeLocation?: object, activeDate?: 'before' | 'after', onClose: () => void }} props
 */
export default function SiteDetailPanel({
  site,
  activeLocation,
  activeDate = 'before',
  onClose,
}) {
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSatelliteLoaded, setIsSatelliteLoaded] = useState(false);

  const [panelDate, setPanelDate] = useState(activeDate || 'before');

  useEffect(() => {
    if (activeDate) setPanelDate(activeDate);
  }, [activeDate]);

  // Fallback to locations registry matching site.locationId or pilot site
  const currentLocation =
    activeLocation ||
    (site?.locationId ? locations.find((l) => l.id === site.locationId) : null) ||
    (Array.isArray(locations)
      ? locations.find((l) => l.id === 'chandur-railway') || locations[0]
      : locations.chandur || locations);

  const satelliteImg =
    panelDate === 'after'
      ? currentLocation?.ndviAfter || ndviAfterImg
      : currentLocation?.ndviBefore || ndviBeforeImg;

  const isPilot = currentLocation?.id === 'chandur-railway';
  const satelliteDateLabel = panelDate === 'after'
    ? (isPilot ? '2026-06-04 (After)' : 'Post-Intervention Sentinel-2')
    : (isPilot ? '2025-12-01 (Before)' : 'Pre-Intervention Baseline');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSatelliteLoaded(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [panelDate]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setReport(null);

    try {
      const result = await generateVerificationReport(site, currentLocation);
      setReport(result);
    } catch (err) {
      console.error('Failed to generate verification report:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [site, currentLocation]);

  /** Format completion date for display */
  const formattedDate = new Date(site.completionDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="site-panel-backdrop"
        id="site-panel-backdrop"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="site-panel" id="site-detail-panel">
        {/* ---- Header ---- */}
        <div className="site-panel__header">
          <div className="site-panel__header-left">
            <h2 className="site-panel__title">{site.siteName}</h2>
            <span className="site-panel__coords">
              📍 {site.lat.toFixed(4)}, {site.lng.toFixed(4)}
            </span>
          </div>
          <button
            className="site-panel__close"
            onClick={onClose}
            aria-label="Close panel"
            id="site-panel-close"
          >
            ✕
          </button>
        </div>

        {/* ---- Body ---- */}
        <div className="site-panel__body">

          {/* Comparison: Saved Photo vs Satellite */}
          <div className="site-panel__comparison">
            {/* LEFT — Saved Photo */}
            <div className="site-panel__card">
              <div className="site-panel__card-label">
                <span>📷</span> Saved Photo
              </div>
              <img
                className="site-panel__card-img"
                src={site.completionPhotoUrl}
                alt={`Completion photo — ${site.siteName}`}
                loading="lazy"
              />
            </div>

            {/* RIGHT — Current Satellite View (Real Sentinel-2 NDVI) */}
            <div className="site-panel__card">
              <div className="site-panel__card-label site-panel__card-label--split">
                <span>🛰️ NDVI</span>
                <div className="site-panel__ndvi-pills">
                  <button
                    className={`site-panel__ndvi-pill ${panelDate === 'before' ? 'active' : ''}`}
                    onClick={() => setPanelDate('before')}
                    type="button"
                    title="View Pre-intervention Baseline (2025-12-01)"
                  >
                    Before
                  </button>
                  <button
                    className={`site-panel__ndvi-pill ${panelDate === 'after' ? 'active' : ''}`}
                    onClick={() => setPanelDate('after')}
                    type="button"
                    title="View Post-intervention Monitoring (2026-06-04)"
                  >
                    After
                  </button>
                </div>
              </div>
              {!isSatelliteLoaded ? (
                <div className="site-panel__satellite-placeholder">
                  <span className="site-panel__satellite-spinner" />
                  <span>Loading Sentinel-2…</span>
                </div>
              ) : (
                <div className="site-panel__satellite-preview">
                  <img
                    className="site-panel__card-img"
                    src={satelliteImg}
                    alt={`Sentinel-2 NDVI ${satelliteDateLabel}`}
                    key={panelDate}
                  />
                  <div className="site-panel__satellite-tag">
                    <span>Sentinel-2 • {satelliteDateLabel}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="site-panel__meta">
            <div className="site-panel__meta-item">
              <span className="site-panel__meta-label">Completion Date</span>
              <span className="site-panel__meta-value">📅 {formattedDate}</span>
            </div>
            <div className="site-panel__meta-item">
              <span className="site-panel__meta-label">Site ID</span>
              <span className="site-panel__meta-value">{site.id}</span>
            </div>
          </div>

          {/* Description */}
          <p className="site-panel__description">{site.description}</p>

          <div className="site-panel__divider" />

          {/* Generate Report Button */}
          <button
            className="site-panel__generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
            id="generate-report-btn"
          >
            {isGenerating ? (
              <>
                <span className="site-panel__satellite-spinner" style={{ width: 16, height: 16 }} />
                Analyzing…
              </>
            ) : (
              <>📊 Generate Report</>
            )}
          </button>

          {/* Report Result */}
          {report && (
            <ReportResult
              status={report.status}
              explanation={report.explanation}
              beforeNdvi={report.beforeNdvi}
              afterNdvi={report.afterNdvi}
              delta={report.delta}
              comparisonPoints={report.comparisonPoints}
            />
          )}
        </div>
      </aside>
    </>
  );
}
