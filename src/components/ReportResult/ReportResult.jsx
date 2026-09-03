import { useState } from 'react';
import './ReportResult.css';

/**
 * Deterministic NDVI comparison report result shown after "Generate Report".
 * Displays status badge, key NDVI metric cards, full point-by-point Before vs After breakdown,
 * and detailed explanation.
 *
 * @param {{
 *   status: 'confirmed' | 'discrepancy',
 *   explanation: string,
 *   beforeNdvi?: number,
 *   afterNdvi?: number,
 *   delta?: number,
 *   comparisonPoints?: Array<{
 *     parameter: string,
 *     icon: string,
 *     before: string,
 *     beforeNote: string,
 *     after: string,
 *     afterNote: string,
 *     difference: string,
 *     diffType: 'positive' | 'neutral',
 *     diffNote: string
 *   }>
 * }} props
 */
export default function ReportResult({
  status,
  explanation,
  beforeNdvi,
  afterNdvi,
  delta,
  comparisonPoints,
}) {
  const [showAllPoints, setShowAllPoints] = useState(true);
  const isConfirmed = status === 'confirmed';
  const modifier = isConfirmed ? 'confirmed' : 'discrepancy';
  const badgeLabel = isConfirmed
    ? 'Confirmed — matches satellite'
    : 'Discrepancy — needs review';
  const icon = isConfirmed ? '✅' : '⚠️';

  const hasMetrics =
    beforeNdvi !== undefined &&
    afterNdvi !== undefined &&
    delta !== undefined;

  const formatNdvi = (val) => {
    if (typeof val !== 'number') return '--';
    return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
  };

  return (
    <div className="report-result" id="report-result">
      {/* Header */}
      <div className="report-result__header">
        <span>📊</span>
        <span>Comparison Report</span>
      </div>

      {/* Confirmation Badge */}
      <span className={`report-result__badge report-result__badge--${modifier}`}>
        <span className="report-result__badge-dot" />
        {icon} {badgeLabel}
      </span>

      {/* Top 3 Summary Metric Cards */}
      {hasMetrics && (
        <div className="report-result__metrics" id="report-result-metrics">
          <div className="report-result__metric">
            <span className="report-result__metric-label">Baseline NDVI</span>
            <span className="report-result__metric-value">{formatNdvi(beforeNdvi)}</span>
          </div>
          <div className="report-result__metric">
            <span className="report-result__metric-label">Current NDVI</span>
            <span className="report-result__metric-value">{formatNdvi(afterNdvi)}</span>
          </div>
          <div className="report-result__metric">
            <span className="report-result__metric-label">Delta (Δ)</span>
            <span
              className={`report-result__metric-value report-result__metric-value--${
                delta > 0.1 ? 'positive' : 'neutral'
              }`}
            >
              {formatNdvi(delta)}
            </span>
          </div>
        </div>
      )}

      {/* Primary Explanation Text */}
      <p className="report-result__text">{explanation}</p>

      {/* Detailed Before vs After Comparison Section */}
      {comparisonPoints && comparisonPoints.length > 0 && (
        <div className="report-diff-section">
          <div className="report-diff-header">
            <div className="report-diff-header__title">
              <span>📋</span>
              <span>Before vs After Parameter Comparison</span>
            </div>
            <button
              className="report-diff-toggle"
              onClick={() => setShowAllPoints((prev) => !prev)}
              type="button"
            >
              {showAllPoints ? 'Collapse ▲' : `View All (${comparisonPoints.length}) ▼`}
            </button>
          </div>

          {showAllPoints && (
            <div className="report-diff-list">
              {comparisonPoints.map((pt, idx) => (
                <div className="report-diff-card" key={idx}>
                  {/* Parameter Title */}
                  <div className="report-diff-card__param">
                    <span className="report-diff-card__icon">{pt.icon}</span>
                    <span className="report-diff-card__name">{pt.parameter}</span>
                  </div>

                  {/* Before vs After Side-by-Side Grid */}
                  <div className="report-diff-grid">
                    {/* BEFORE Column */}
                    <div className="report-diff-col report-diff-col--before">
                      <div className="report-diff-col__tag">BEFORE (2025-12-01)</div>
                      <div className="report-diff-col__val">{pt.before}</div>
                      <div className="report-diff-col__note">{pt.beforeNote}</div>
                    </div>

                    {/* Arrow Divider */}
                    <div className="report-diff-arrow">➔</div>

                    {/* AFTER Column */}
                    <div className="report-diff-col report-diff-col--after">
                      <div className="report-diff-col__tag">AFTER (2026-06-04)</div>
                      <div className="report-diff-col__val">{pt.after}</div>
                      <div className="report-diff-col__note">{pt.afterNote}</div>
                    </div>
                  </div>

                  {/* Difference / Net Impact Footer */}
                  <div className="report-diff-impact">
                    <span className="report-diff-impact__label">NET DIFFERENCE:</span>
                    <span
                      className={`report-diff-impact__val report-diff-impact__val--${pt.diffType}`}
                    >
                      {pt.difference}
                    </span>
                    <span className="report-diff-impact__note">({pt.diffNote})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
