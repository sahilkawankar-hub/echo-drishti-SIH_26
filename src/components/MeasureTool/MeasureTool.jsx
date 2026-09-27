import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MeasureTool.css';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Haversine distance between two [lat, lng] pairs.
 * @returns {number} distance in meters
 */
function haversineMeters([lat1, lng1], [lat2, lng2]) {
  const R = 6371000; // Earth radius in meters
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Format distance for display.
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters.toFixed(0)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/* ================================================================
   MeasureMapLayer — Rendered INSIDE MapContainer.
   Handles click events and draws measurement lines on the map.
   ================================================================ */
export function MeasureMapLayer({ isActive, points, setPoints, mousePos, setMousePos }) {
  const map = useMap();
  const polylineRef = useRef(null);
  const previewRef = useRef(null);
  const markersRef = useRef([]);
  const labelMarkersRef = useRef([]);

  // Map click & mousemove events
  useMapEvents({
    click(e) {
      if (isActive) {
        setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
      }
    },
    mousemove(e) {
      if (isActive) {
        setMousePos([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  // Draw the confirmed measurement polyline & markers
  useEffect(() => {
    // Clear existing
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    labelMarkersRef.current.forEach((m) => m.remove());
    labelMarkersRef.current = [];

    if (points.length === 0) return;

    // Draw polyline
    polylineRef.current = L.polyline(points, {
      color: '#38bdf8',
      weight: 3,
      opacity: 0.9,
    }).addTo(map);

    // Draw point markers & distance labels
    points.forEach((point, i) => {
      const marker = L.circleMarker(point, {
        radius: 5,
        color: '#fff',
        fillColor: i === 0 ? '#34d399' : '#38bdf8',
        fillOpacity: 1,
        weight: 2,
      }).addTo(map);
      markersRef.current.push(marker);

      if (i > 0) {
        const dist = haversineMeters(points[i - 1], point);
        const midLat = (points[i - 1][0] + point[0]) / 2;
        const midLng = (points[i - 1][1] + point[1]) / 2;

        const labelIcon = L.divIcon({
          className: 'measure-label',
          html: `<span class="measure-label__text">${formatDistance(dist)}</span>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        });

        const labelMarker = L.marker([midLat, midLng], {
          icon: labelIcon,
          interactive: false,
        }).addTo(map);
        labelMarkersRef.current.push(labelMarker);
      }
    });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      labelMarkersRef.current.forEach((m) => m.remove());
      labelMarkersRef.current = [];
    };
  }, [map, points]);

  // Draw the preview line from last point to cursor
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.remove();
      previewRef.current = null;
    }

    if (points.length > 0 && mousePos && isActive) {
      previewRef.current = L.polyline(
        [points[points.length - 1], mousePos],
        {
          color: '#38bdf8',
          weight: 2,
          opacity: 0.5,
          dashArray: '6 4',
        }
      ).addTo(map);
    }

    return () => {
      if (previewRef.current) {
        previewRef.current.remove();
        previewRef.current = null;
      }
    };
  }, [map, points, mousePos, isActive]);

  // Change cursor when measure mode is active
  useEffect(() => {
    const container = map.getContainer();
    if (isActive) {
      container.style.cursor = 'crosshair';
    } else {
      container.style.cursor = '';
    }
    return () => {
      container.style.cursor = '';
    };
  }, [map, isActive]);

  return null;
}

/* ================================================================
   MeasureToolOverlay — Rendered OUTSIDE MapContainer.
   Shows the floating button and measurement info panel.
   ================================================================ */
export default function MeasureToolOverlay({ isActive, setIsActive, points, setPoints, mousePos }) {
  const { lang, t } = useLanguage();

  /**
   * Calculate total distance from all measurement points.
   */
  const totalDistance = points.reduce((sum, point, i) => {
    if (i === 0) return 0;
    return sum + haversineMeters(points[i - 1], point);
  }, 0);

  /**
   * Distance from last point to cursor (live preview).
   */
  const previewDistance =
    isActive && points.length > 0 && mousePos
      ? haversineMeters(points[points.length - 1], mousePos)
      : 0;

  const handleToggle = useCallback(() => {
    setIsActive((prev) => {
      if (prev) {
        setPoints([]);
      }
      return !prev;
    });
  }, [setIsActive, setPoints]);

  const handleClear = useCallback(() => {
    setPoints([]);
  }, [setPoints]);

  const handleUndo = useCallback(() => {
    setPoints((prev) => prev.slice(0, -1));
  }, [setPoints]);

  return (
    <div className={`measure-tool${isActive ? ' measure-tool--active' : ''}`} id="measure-tool">
      {/* Toggle Button */}
      <button
        className={`measure-tool__btn${isActive ? ' measure-tool__btn--active' : ''}`}
        onClick={handleToggle}
        title={t.measureDistanceBtn}
        id="measure-tool-btn"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
          <path d="m14.5 12.5 2-2" />
          <path d="m11.5 9.5 2-2" />
          <path d="m8.5 6.5 2-2" />
          <path d="m17.5 15.5 2-2" />
        </svg>
      </button>

      {/* Measurement Info Panel */}
      {isActive && (
        <div className="measure-tool__panel" id="measure-tool-panel">
          <div className="measure-tool__panel-header">
            <span className="measure-tool__panel-icon">📏</span>
            <span className="measure-tool__panel-title">{t.measureTitle}</span>
          </div>

          {points.length === 0 ? (
            <p className="measure-tool__hint">{t.measureHint}</p>
          ) : (
            <>
              {/* Segment breakdown */}
              <div className="measure-tool__segments">
                {points.map((point, i) => {
                  if (i === 0) return null;
                  const segDist = haversineMeters(points[i - 1], point);
                  return (
                    <div className="measure-tool__segment" key={i}>
                      <span className="measure-tool__segment-label">
                        {lang === 'hi' ? `खंड ${i}` : `Segment ${i}`}
                      </span>
                      <span className="measure-tool__segment-value">
                        {formatDistance(segDist)}
                      </span>
                    </div>
                  );
                })}

                {/* Live preview segment */}
                {mousePos && points.length > 0 && (
                  <div className="measure-tool__segment measure-tool__segment--preview">
                    <span className="measure-tool__segment-label">
                      → {lang === 'hi' ? 'कर्सर' : 'cursor'}
                    </span>
                    <span className="measure-tool__segment-value">
                      + {formatDistance(previewDistance)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total distance */}
              <div className="measure-tool__total">
                <span className="measure-tool__total-label">{t.measureTotal}</span>
                <span className="measure-tool__total-value">
                  {formatDistance(totalDistance)}
                </span>
              </div>

              {/* Action buttons */}
              <div className="measure-tool__actions">
                <button
                  className="measure-tool__action-btn"
                  onClick={handleUndo}
                  disabled={points.length === 0}
                  title={t.undoBtn}
                  type="button"
                >
                  ↩ {t.undoBtn}
                </button>
                <button
                  className="measure-tool__action-btn measure-tool__action-btn--clear"
                  onClick={handleClear}
                  title={t.clearBtn}
                  type="button"
                >
                  ✕ {t.clearBtn}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
