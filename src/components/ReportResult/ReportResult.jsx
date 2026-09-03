import './ReportResult.css';

/**
 * Placeholder comparison report result shown after "Generate Report".
 * Randomly picks confirmed vs discrepancy and displays a badge + explanation.
 *
 * @param {{ status: 'confirmed' | 'discrepancy', explanation: string }} props
 */
export default function ReportResult({ status, explanation }) {
  const isConfirmed = status === 'confirmed';
  const modifier = isConfirmed ? 'confirmed' : 'discrepancy';
  const badgeLabel = isConfirmed
    ? 'Confirmed — matches satellite'
    : 'Discrepancy — needs review';
  const icon = isConfirmed ? '✅' : '⚠️';

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

      <p className="report-result__text">{explanation}</p>
    </div>
  );
}
