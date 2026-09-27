import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './ElevationProfile.css';

/**
 * Elevation & Catchment Topography Profile Component.
 * Displays cross-section altitude, slope gradients, and hydrological recommendations.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 * }} props
 */
export default function ElevationProfile({ isOpen, onClose }) {
  const { lang, t } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!isOpen) return null;

  // Realistic digital elevation model (DEM) transect points across the Chandur Railway catchment (3.2 km transect)
  const profilePoints = [
    { dist: 0.0, elev: 462, slope: 12.4, feature: 'Catchment Ridge Top' },
    { dist: 0.3, elev: 451, slope: 10.1, feature: 'Upper Afforestation Slope' },
    { dist: 0.6, elev: 436, slope: 8.5,  feature: 'Contour Trench Zone' },
    { dist: 0.9, elev: 418, slope: 7.2,  feature: 'Gully Plug #09 Drainage' },
    { dist: 1.2, elev: 405, slope: 5.8,  feature: 'Proposed Check Dam #08B' },
    { dist: 1.6, elev: 392, slope: 4.6,  feature: 'Check Dam #07A Impoundment' },
    { dist: 2.0, elev: 378, slope: 3.9,  feature: 'Middle Basin Farmland' },
    { dist: 2.4, elev: 366, slope: 3.2,  feature: 'Masonry Anicut #03' },
    { dist: 2.8, elev: 354, slope: 2.5,  feature: 'Community Farm Pond #12' },
    { dist: 3.2, elev: 342, slope: 1.8,  feature: 'South Outlet Stream Bed' },
  ];

  const minElev = 340;
  const maxElev = 480;
  const elevRange = maxElev - minElev;

  // Compute SVG chart path
  const svgWidth = 560;
  const svgHeight = 110;
  const paddingX = 40;
  const paddingY = 15;

  const getX = (dist) => paddingX + (dist / 3.2) * (svgWidth - 2 * paddingX);
  const getY = (elev) => svgHeight - paddingY - ((elev - minElev) / elevRange) * (svgHeight - 2 * paddingY);

  const pathData = profilePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.dist)} ${getY(p.elev)}`)
    .join(' ');

  const areaData = `${pathData} L ${getX(3.2)} ${svgHeight - paddingY} L ${getX(0)} ${svgHeight - paddingY} Z`;

  const activePoint = hoveredIdx !== null ? profilePoints[hoveredIdx] : profilePoints[4]; // Default to check dam point

  return (
    <div className="elevation-panel" id="elevation-profile-panel">
      <div className="elevation-panel__header">
        <div className="elevation-panel__title-left">
          <span className="elevation-panel__icon">📈</span>
          <div>
            <span className="elevation-panel__title">{t.elevationTitle}</span>
            <span className="elevation-panel__sub">
              {lang === 'hi' ? '3.2 किमी जलसंभर प्रवाह ढलान (DEM/SRTM 30m)' : '3.2 km Hydrological Drainage Transect (DEM 30m)'}
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="elevation-stats">
          <div className="elevation-stat">
            <span className="elevation-stat__label">{t.elevMax}</span>
            <span className="elevation-stat__val">462 m</span>
          </div>
          <div className="elevation-stat">
            <span className="elevation-stat__label">{t.elevMin}</span>
            <span className="elevation-stat__val">342 m</span>
          </div>
          <div className="elevation-stat">
            <span className="elevation-stat__label">{t.elevGain}</span>
            <span className="elevation-stat__val">120 m</span>
          </div>
          <div className="elevation-stat">
            <span className="elevation-stat__label">{t.elevSlope}</span>
            <span className="elevation-stat__val elevation-stat__val--cyan">5.8%</span>
          </div>
        </div>

        <button
          type="button"
          className="elevation-panel__close"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* SVG Elevation Chart */}
      <div className="elevation-chart-wrapper">
        <svg
          className="elevation-svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="elevFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0d2238" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[460, 420, 380, 340].map((h) => (
            <line
              key={h}
              x1={paddingX}
              y1={getY(h)}
              x2={svgWidth - paddingX}
              y2={getY(h)}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="3 3"
            />
          ))}

          {/* Area Fill */}
          <path d={areaData} fill="url(#elevFillGrad)" />

          {/* Line Path */}
          <path
            d={pathData}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Interactive Points */}
          {profilePoints.map((p, i) => {
            const cx = getX(p.dist);
            const cy = getY(p.elev);
            const isSelected = hoveredIdx === i;
            return (
              <g key={i} onMouseEnter={() => setHoveredIdx(i)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 3.5}
                  fill={p.elev >= 420 ? '#f59e0b' : '#34d399'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Hovered Point Tooltip */}
        <div className="elevation-point-spec">
          <span className="elevation-spec__name">{activePoint.feature}</span>
          <span className="elevation-spec__metric">
            <strong>{activePoint.elev} m MSL</strong> • {activePoint.dist.toFixed(1)} km mark • Slope: {activePoint.slope}%
          </span>
        </div>
      </div>

      {/* Engineering Recommendation Note */}
      <div className="elevation-recommendation">
        <span className="elevation-rec-icon">💡</span>
        <span className="elevation-rec-text">{t.idealStructureHint}</span>
      </div>
    </div>
  );
}
