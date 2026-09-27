import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import './CompassRose.css';
import { useLanguage } from '../../context/LanguageContext';

/**
 * CompassRose — Google Maps style interactive map rotation & orientation control.
 * Supports smooth rotation (↺ ↻), reset to North (0°), real-time bearing readout,
 * and cardinal direction indicator.
 */
export default function CompassRose({
  bearing = 0,
  onRotateLeft,
  onRotateRight,
  onResetNorth,
}) {
  const { lang } = useLanguage();

  const getCardinal = (deg) => {
    const d = ((deg % 360) + 360) % 360;
    if (d >= 337.5 || d < 22.5) return 'N';
    if (d >= 22.5 && d < 67.5) return 'NE';
    if (d >= 67.5 && d < 112.5) return 'E';
    if (d >= 112.5 && d < 157.5) return 'SE';
    if (d >= 157.5 && d < 202.5) return 'S';
    if (d >= 202.5 && d < 247.5) return 'SW';
    if (d >= 247.5 && d < 292.5) return 'W';
    return 'NW';
  };

  const roundedBearing = Math.round(((bearing % 360) + 360) % 360);
  const isRotated = roundedBearing !== 0;

  return (
    <div className="compass-control-group" id="google-maps-rotation-control">
      {/* Rotate Left Button (Counter-Clockwise 15°) */}
      <button
        type="button"
        className="compass-btn compass-btn--rotate"
        onClick={onRotateLeft}
        title={lang === 'hi' ? '15° बाएँ घुमाएँ' : 'Rotate Counter-Clockwise 15° (↺)'}
        aria-label="Rotate Counter-Clockwise"
        id="map-rotate-left-btn"
      >
        ↺
      </button>

      {/* Main Interactive Compass Rose — Click to Reset North */}
      <button
        type="button"
        className={`compass-rose${isRotated ? ' compass-rose--rotated' : ''}`}
        onClick={onResetNorth}
        title={
          lang === 'hi'
            ? `उत्तर दिशा रीसेट करें (${roundedBearing}° ${getCardinal(roundedBearing)}) • Shift+ड्रैग से घुमाएँ`
            : `Click to Reset North (${roundedBearing}° ${getCardinal(roundedBearing)}) • Hold Shift + Drag map to rotate freely`
        }
        aria-label="Reset North"
        id="compass-rose-btn"
      >
        <div
          className="compass-rose__ring"
          style={{ transform: `rotate(${-roundedBearing}deg)` }}
        >
          {/* Tick marks around the ring */}
          {Array.from({ length: 36 }, (_, i) => (
            <span
              key={i}
              className={`compass-rose__tick${i % 9 === 0 ? ' compass-rose__tick--major' : ''}`}
              style={{ transform: `rotate(${i * 10}deg)` }}
            />
          ))}

          {/* Cardinal direction labels */}
          <span className="compass-rose__label compass-rose__label--n">N</span>
          <span className="compass-rose__label compass-rose__label--e">E</span>
          <span className="compass-rose__label compass-rose__label--s">S</span>
          <span className="compass-rose__label compass-rose__label--w">W</span>

          {/* Center needle */}
          <div className="compass-rose__needle">
            <div className="compass-rose__needle-north" />
            <div className="compass-rose__needle-south" />
          </div>

          {/* Center dot */}
          <div className="compass-rose__center" />
        </div>

        {/* Bearing Badge */}
        <span className="compass-bearing-badge">
          {roundedBearing}° {getCardinal(roundedBearing)}
        </span>
      </button>

      {/* Rotate Right Button (Clockwise 15°) */}
      <button
        type="button"
        className="compass-btn compass-btn--rotate"
        onClick={onRotateRight}
        title={lang === 'hi' ? '15° दाएँ घुमाएँ' : 'Rotate Clockwise 15° (↻)'}
        aria-label="Rotate Clockwise"
        id="map-rotate-right-btn"
      >
        ↻
      </button>
    </div>
  );
}

/**
 * ScaleBarControl — Adds Leaflet's built-in scale bar to the map.
 * Must be rendered inside a MapContainer.
 */
export function ScaleBarControl() {
  const map = useMap();

  useEffect(() => {
    const ctrl = L.control.scale({
      position: 'bottomleft',
      metric: true,
      imperial: false,
      maxWidth: 150,
    });

    ctrl.addTo(map);

    return () => {
      ctrl.remove();
    };
  }, [map]);

  return null;
}
