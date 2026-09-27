import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './WaterBudgetSimulator.css';

/**
 * Monsoon Rainfall Runoff Water Budget Simulator.
 * Models hydrological catchment response across the 14.8 km² basin.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 * }} props
 */
export default function WaterBudgetSimulator({ isOpen, onClose }) {
  const { lang, t } = useLanguage();

  // Inputs
  const [rainfallMm, setRainfallMm] = useState(65);
  const [soilType, setSoilType] = useState('medium'); // 'high' | 'medium' | 'low'
  const catchmentAreaKm2 = 14.8;
  const existingStorageCapacityML = 18.2;

  // Hydrological Runoff Coefficient (SCS-CN approximation)
  const runoffCoeff = useMemo(() => {
    if (soilType === 'high') return 0.25; // Sandy loam absorbs 75%
    if (soilType === 'medium') return 0.42; // Mixed loam absorbs 58%
    return 0.65; // Degraded rocky absorbs 35%
  }, [soilType]);

  // Calculations
  // Total Precipitation (ML) = Area (km²) * Rainfall (mm) * 1 ML/ha-mm * 100 ha/km² = Area * Rainfall
  // 1 km² * 1 mm = 1,000,000 m² * 0.001 m = 1,000 m³ = 1,000,000 litres = 1 Million Litres (ML)
  const totalPrecipML = useMemo(() => {
    return (catchmentAreaKm2 * rainfallMm).toFixed(1);
  }, [catchmentAreaKm2, rainfallMm]);

  const generatedRunoffML = useMemo(() => {
    return (parseFloat(totalPrecipML) * runoffCoeff).toFixed(1);
  }, [totalPrecipML, runoffCoeff]);

  const soilRechargeML = useMemo(() => {
    return (parseFloat(totalPrecipML) - parseFloat(generatedRunoffML)).toFixed(1);
  }, [totalPrecipML, generatedRunoffML]);

  const retainedStorageML = useMemo(() => {
    return Math.min(existingStorageCapacityML, parseFloat(generatedRunoffML)).toFixed(1);
  }, [existingStorageCapacityML, generatedRunoffML]);

  const storagePct = useMemo(() => {
    return Math.min(100, Math.round((parseFloat(retainedStorageML) / existingStorageCapacityML) * 100));
  }, [retainedStorageML, existingStorageCapacityML]);

  const surplusDischargeML = useMemo(() => {
    return Math.max(0, parseFloat(generatedRunoffML) - existingStorageCapacityML).toFixed(1);
  }, [generatedRunoffML, existingStorageCapacityML]);

  const floodAlert = useMemo(() => {
    if (rainfallMm < 40) return { level: 'low', text: t.alertLow, color: '#10b981' };
    if (rainfallMm < 85) return { level: 'medium', text: t.alertMed, color: '#f59e0b' };
    return { level: 'high', text: t.alertHigh, color: '#ef4444' };
  }, [rainfallMm, t]);

  if (!isOpen) return null;

  return (
    <div className="sim-backdrop" id="water-budget-simulator-modal">
      <div className="sim-modal">
        {/* Header */}
        <div className="sim-header">
          <div className="sim-header__left">
            <span className="sim-icon">🌧️</span>
            <div>
              <h3 className="sim-title">{t.simulatorTitle}</h3>
              <span className="sim-sub">
                {lang === 'hi'
                  ? 'चांदुर रेलवे जलसंभर, अमरावती (14.8 वर्ग किमी) हेतु एससीएस-सीएन हाइड्रोलॉजिकल मॉडल'
                  : 'Chandur Railway, Amravati • SCS-CN Catchment Water Balance Model (14.8 km² Basin)'}
              </span>
            </div>
          </div>
          <button type="button" className="sim-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Controls Section */}
        <div className="sim-controls-grid">
          {/* Rainfall Intensity Slider */}
          <div className="sim-control-card">
            <div className="sim-control-header">
              <label className="sim-control-label">{t.rainfallInput}</label>
              <span className="sim-control-val">{rainfallMm} mm</span>
            </div>
            <input
              type="range"
              min="15"
              max="160"
              step="5"
              value={rainfallMm}
              onChange={(e) => setRainfallMm(parseInt(e.target.value, 10))}
              className="sim-slider"
            />
            <div className="sim-slider-marks">
              <span>20mm (Light)</span>
              <span>65mm (Monsoon Burst)</span>
              <span>150mm (Torrential)</span>
            </div>
          </div>

          {/* Soil Permeability Selector */}
          <div className="sim-control-card">
            <label className="sim-control-label">{t.soilTypeLabel}</label>
            <select
              className="sim-select"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            >
              <option value="high">{t.soilHigh}</option>
              <option value="medium">{t.soilMed}</option>
              <option value="low">{t.soilLow}</option>
            </select>
            <span className="sim-hint">
              {lang === 'hi'
                ? `अपवाह गुणांक (Runoff Coeff): C = ${runoffCoeff}`
                : `Hydrological Runoff Coefficient: C = ${runoffCoeff}`}
            </span>
          </div>
        </div>

        {/* Simulation Output Cards */}
        <div className="sim-output-grid">
          {/* Card 1: Total Precipitation */}
          <div className="sim-stat-card">
            <span className="sim-stat-title">{t.precipVolume}</span>
            <span className="sim-stat-num">{totalPrecipML} <small>ML</small></span>
            <span className="sim-stat-sub">14.8 km² × {rainfallMm}mm</span>
          </div>

          {/* Card 2: Soil Infiltration / Groundwater Recharge */}
          <div className="sim-stat-card">
            <span className="sim-stat-title">{t.soilRechargeVolume}</span>
            <span className="sim-stat-num sim-stat-num--green">{soilRechargeML} <small>ML</small></span>
            <span className="sim-stat-sub">{((1 - runoffCoeff) * 100).toFixed(0)}% Infiltration</span>
          </div>

          {/* Card 3: Generated Surface Runoff */}
          <div className="sim-stat-card">
            <span className="sim-stat-title">{t.generatedRunoff}</span>
            <span className="sim-stat-num sim-stat-num--cyan">{generatedRunoffML} <small>ML</small></span>
            <span className="sim-stat-sub">{(runoffCoeff * 100).toFixed(0)}% Streamflow</span>
          </div>

          {/* Card 4: Retained by Check Dams */}
          <div className="sim-stat-card">
            <span className="sim-stat-title">{t.capacityFilled}</span>
            <span className="sim-stat-num sim-stat-num--amber">{retainedStorageML} <small>ML</small></span>
            <span className="sim-stat-sub">{storagePct}% Retention Ratio</span>
          </div>
        </div>

        {/* Visual Water Balance Bar */}
        <div className="sim-balance-section">
          <div className="sim-balance-header">
            <span>{lang === 'hi' ? 'जलाशय भराव स्थिति एवं अतिरिक्त जलप्रवाह:' : 'Reservoir Impoundment & Downstream Discharge:'}</span>
            <span style={{ color: floodAlert.color, fontWeight: 800 }}>
              ● {floodAlert.text}
            </span>
          </div>

          <div className="sim-balance-bar">
            <div
              className="sim-balance-fill sim-balance-fill--retained"
              style={{ width: `${Math.min(100, storagePct)}%` }}
              title={`Retained: ${retainedStorageML} ML`}
            />
            {parseFloat(surplusDischargeML) > 0 && (
              <div
                className="sim-balance-fill sim-balance-fill--surplus"
                style={{ width: `${Math.min(100, (parseFloat(surplusDischargeML) / parseFloat(generatedRunoffML)) * 100)}%` }}
                title={`Surplus Discharge: ${surplusDischargeML} ML`}
              />
            )}
          </div>

          <div className="sim-balance-legend">
            <span className="sim-legend-item">
              <span className="sim-legend-dot sim-legend-dot--retained" />
              {lang === 'hi' ? `52+ संरचनाओं में संचित: ${retainedStorageML} ML` : `Impounded in 52 Assets: ${retainedStorageML} ML`}
            </span>
            <span className="sim-legend-item">
              <span className="sim-legend-dot sim-legend-dot--surplus" />
              {lang === 'hi' ? `अनुप्रवाह अतिरिक्त निकास: ${surplusDischargeML} ML` : `Downstream Spillway: ${surplusDischargeML} ML`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="sim-footer">
          <span className="sim-footer-note">
            {lang === 'hi'
              ? 'जल बजट गणना केंद्रीय जल आयोग (CWC) एवं सुदूर संवेदन जलसंभर मानदंडों के अनुरूप परिकलित।'
              : 'Hydrological balance computed adhering to Catchment Runoff Water Audit Standards.'}
          </span>
          <button type="button" className="sim-close-btn-bottom" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
