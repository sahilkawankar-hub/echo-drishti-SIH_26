import './ReportResult.css';

/**
 * Deterministic NDVI comparison report result shown after "Generate Report".
 * Displays status badge, key NDVI metric cards (before, after, delta), and detailed explanation.
 *
 * @param {{
 *   status: 'confirmed' | 'discrepancy',
 *   explanation: string,
 *   beforeNdvi?: number,
 *   afterNdvi?: number,
 *   delta?: number
 * }} props
 */
export default function ReportResult({
  status,
  explanation,
  beforeNdvi,
  afterNdvi,
  delta,
}) {
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
      <div className="report-result__header">
        <span>📊</span>
        <span>Comparison Report</span>
      </div>

      <span className={`report-result__badge report-result__badge--${modifier}`}>
        <span className="report-result__badge-dot" />
        {icon} {badgeLabel}
      </span>

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

      <p className="report-result__text">{explanation}</p>
    </div>
  );
}
