import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './AddStructureModal.css';

/**
 * Modal dialog for officers to propose and record a new water asset at clicked coordinates.
 *
 * @param {{
 *   coordinates: [number, number],
 *   onSave: (structure: object) => void,
 *   onCancel: () => void,
 * }} props
 */
export default function AddStructureModal({ coordinates, onSave, onCancel }) {
  const { lang, t } = useLanguage();
  const [name, setName] = useState('Check Dam #08B (Proposed)');
  const [type, setType] = useState('checkdam');
  const [capacity, setCapacity] = useState('2.5');
  const [budget, setBudget] = useState('3.8');
  const [panchayat, setPanchayat] = useState('Kolyari');
  const [targetDate, setTargetDate] = useState('2026-11-30');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStructure = {
      id: `proposed-${Date.now()}`,
      name,
      type,
      lat: coordinates[0],
      lng: coordinates[1],
      capacity: parseFloat(capacity) || 2.0,
      budget: parseFloat(budget) || 3.5,
      panchayat,
      targetDate,
      status: 'proposed',
      isProposed: true,
      verified: false,
      inspectionDate: 'Proposed Q4 2026',
      details: `Field proposed water conservation structure at ${panchayat} Gram Panchayat. Designed impoundment capacity: ${capacity} ML.`,
    };
    onSave(newStructure);
  };

  return (
    <div className="add-struct-modal-backdrop" id="add-structure-modal">
      <div className="add-struct-modal">
        {/* Header */}
        <div className="add-struct-modal__header">
          <div className="add-struct-modal__header-left">
            <span className="add-struct-modal__icon">📍</span>
            <div>
              <h3 className="add-struct-modal__title">{t.addStructureTitle}</h3>
              <span className="add-struct-modal__sub">{t.addStructureSub}</span>
            </div>
          </div>
          <button
            type="button"
            className="add-struct-modal__close"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        {/* Coordinates Pill */}
        <div className="add-struct-coords-badge">
          <span>🎯 Geotag Coordinates:</span>
          <strong>{coordinates[0].toFixed(5)}° N, {coordinates[1].toFixed(5)}° E</strong>
        </div>

        {/* Form */}
        <form className="add-struct-form" onSubmit={handleSubmit}>
          <div className="add-struct-form-group">
            <label className="add-struct-label">{t.assetName}</label>
            <input
              type="text"
              className="add-struct-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="add-struct-form-row">
            <div className="add-struct-form-group">
              <label className="add-struct-label">{t.assetType}</label>
              <select
                className="add-struct-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="checkdam">Check Dam (चेक डैम)</option>
                <option value="anicut">Masonry Anicut (चिनाई अनिकट)</option>
                <option value="pond">Community Farm Pond (खेत तालाब)</option>
                <option value="gully">Gully Plug Block (गली प्लग)</option>
                <option value="percolation">Percolation Tank (रिसाव तालाब)</option>
              </select>
            </div>

            <div className="add-struct-form-group">
              <label className="add-struct-label">{t.assetPanchayat}</label>
              <select
                className="add-struct-select"
                value={panchayat}
                onChange={(e) => setPanchayat(e.target.value)}
              >
                <option value="Kolyari">Kolyari (कोल्यारी)</option>
                <option value="Bakarol">Bakarol (बाकरोल)</option>
                <option value="Malviya">Malviya (मालवीय)</option>
                <option value="Mamer">Mamer (मामेर)</option>
              </select>
            </div>
          </div>

          <div className="add-struct-form-row">
            <div className="add-struct-form-group">
              <label className="add-struct-label">{t.assetCapacity}</label>
              <input
                type="number"
                step="0.1"
                className="add-struct-input"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>

            <div className="add-struct-form-group">
              <label className="add-struct-label">{t.assetBudget}</label>
              <input
                type="number"
                step="0.1"
                className="add-struct-input"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="add-struct-form-group">
            <label className="add-struct-label">{t.assetTargetDate}</label>
            <input
              type="date"
              className="add-struct-input"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="add-struct-actions">
            <button
              type="button"
              className="add-struct-btn add-struct-btn--cancel"
              onClick={onCancel}
            >
              {t.close}
            </button>
            <button
              type="submit"
              className="add-struct-btn add-struct-btn--save"
              id="confirm-add-structure-btn"
            >
              💾 {t.submitAssetProposal}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
