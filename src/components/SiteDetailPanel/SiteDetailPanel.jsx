import { useState, useCallback, useEffect } from 'react';
import ReportResult from '../ReportResult/ReportResult';
import ndviBeforeImg from '../../assets/ndvi_before_2025-12-01.png';
import ndviAfterImg from '../../assets/ndvi_after_2026-06-04.png';
import './SiteDetailPanel.css';

/**
 * Placeholder explanations for the randomly generated report.
 */
const CONFIRMED_EXPLANATIONS = [
  'Vegetation cover in this area has increased since completion, consistent with the intervention goals.',
  'NDVI values show a 12% improvement over the baseline, confirming positive impact.',
  'Water retention index matches expected post-construction levels.',
];

const DISCREPANCY_EXPLANATIONS = [
  'Vegetation cover in this area has not increased since completion. Ground review recommended.',
  'NDWI readings indicate the water body is significantly smaller than the designed capacity.',
  'Land-use classification shows encroachment activity near the intervention site.',
];

/**
 * Side panel that shows a detailed view for a selected saved site.
 * Displays the saved completion photo alongside real Sentinel-2 NDVI imagery,
 * and a "Generate Report" button that produces a comparison result.
 *
 * @param {{ site: object, activeDate?: 'before' | 'after', onClose: () => void }} props
 */
export default function SiteDetailPanel({ site, activeDate = 'before', onClose }) {
  const [report, setReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSatelliteLoaded, setIsSatelliteLoaded] = useState(false);

  const satelliteImg = activeDate === 'after' ? ndviAfterImg : ndviBeforeImg;
  const satelliteDateLabel = activeDate === 'after' ? '2026-06-04 (After)' : '2025-12-01 (Before)';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSatelliteLoaded(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [activeDate]);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setReport(null);

    // Simulate a short processing delay
    setTimeout(() => {
      const isConfirmed = Math.random() > 0.5;
      const pool = isConfirmed ? CONFIRMED_EXPLANATIONS : DISCREPANCY_EXPLANATIONS;
      const explanation = pool[Math.floor(Math.random() * pool.length)];

      setReport({
        status: isConfirmed ? 'confirmed' : 'discrepancy',
        explanation,
      });
      setIsGenerating(false);
    }, 900);
  }, []);

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
              <div className="site-panel__card-label">
                <span>🛰️</span> NDVI ({activeDate === 'after' ? 'After' : 'Before'})
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
            />
          )}
        </div>
      </aside>
    </>
  );
}
