import { useState, useCallback } from 'react';
import './BeforeAfterToggle.css';
import { useLanguage } from '../../context/LanguageContext';

/**
 * A two-state temporal toggle (Before / After) rendered as a floating pill bar.
 * Supports Hindi and English.
 */
export default function BeforeAfterToggle({ value, onChange, isPanelOpen = false }) {
  const { lang, t } = useLanguage();
  const [internalDate, setInternalDate] = useState('before');
  const activeDate = value !== undefined ? value : internalDate;

  const handleSwitch = useCallback(
    (val) => {
      setInternalDate(val);
      onChange?.(val);
    },
    [onChange]
  );

  return (
    <div
      className={`ba-toggle${isPanelOpen ? ' ba-toggle--panel-open' : ''}`}
      id="before-after-toggle"
    >
      <button
        id="ba-btn-before"
        className={`ba-toggle__btn${activeDate === 'before' ? ' ba-toggle__btn--active' : ''}`}
        onClick={() => handleSwitch('before')}
        aria-pressed={activeDate === 'before'}
        type="button"
      >
        <span className="ba-toggle__btn-icon">◀</span>
        {t.toggleBefore}
      </button>

      <button
        id="ba-btn-after"
        className={`ba-toggle__btn${activeDate === 'after' ? ' ba-toggle__btn--active' : ''}`}
        onClick={() => handleSwitch('after')}
        aria-pressed={activeDate === 'after'}
        type="button"
      >
        {t.toggleAfter}
        <span className="ba-toggle__btn-icon">▶</span>
      </button>
    </div>
  );
}
