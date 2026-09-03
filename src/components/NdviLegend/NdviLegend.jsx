import './NdviLegend.css';

export default function NdviLegend({ activeDate }) {
  const dateLabel = activeDate === 'after' ? '04 Jun 2026 (Post-Monsoon)' : '01 Dec 2025 (Baseline)';

  return (
    <div className="ndvi-legend" id="ndvi-legend">
      <div className="ndvi-legend__header">
        <span className="ndvi-legend__icon">🌿</span>
        <div>
          <span className="ndvi-legend__title">NDVI Index</span>
          <span className="ndvi-legend__date">{dateLabel}</span>
        </div>
      </div>
      <div className="ndvi-legend__bar" />
      <div className="ndvi-legend__ticks">
        <span>-0.2</span>
        <span>0.0</span>
        <span>0.3</span>
        <span>0.6</span>
        <span>0.8+</span>
      </div>
      <div className="ndvi-legend__labels">
        <span>Barren / Water</span>
        <span>Moderate</span>
        <span>Dense Canopy</span>
      </div>
    </div>
  );
}
