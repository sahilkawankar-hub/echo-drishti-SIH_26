import { useState, useCallback } from 'react';
import './BeforeAfterToggle.css';

/**
 * A two-state toggle (Before / After) rendered as a floating pill bar.
 * Changes the `activeDate` state and logs it to the console.
 *
 * TODO: Wire `activeDate` to actual layer-swapping logic so that
 *       satellite imagery changes between two time snapshots.
 *
 * @param {{ onChange?: (activeDate: 'before' | 'after') => void }} props
 */
export default function BeforeAfterToggle({ onChange }) {
  const [activeDate, setActiveDate] = useState('before');

  const handleSwitch = useCallback(
    (value) => {
      setActiveDate(value);
      console.log(`[BeforeAfterToggle] activeDate changed → "${value}"`);
      onChange?.(value);
    },
    [onChange]
  );

  return (
    <div className="ba-toggle" id="before-after-toggle">
      <span className="ba-toggle__label">🕓 Temporal</span>
      <div className="ba-toggle__divider" />

      <button
        id="ba-btn-before"
        className={`ba-toggle__btn${activeDate === 'before' ? ' ba-toggle__btn--active' : ''}`}
        onClick={() => handleSwitch('before')}
        aria-pressed={activeDate === 'before'}
      >
        <span className="ba-toggle__btn-icon">◀</span>
        Before
      </button>

      <button
        id="ba-btn-after"
        className={`ba-toggle__btn${activeDate === 'after' ? ' ba-toggle__btn--active' : ''}`}
        onClick={() => handleSwitch('after')}
        aria-pressed={activeDate === 'after'}
      >
        After
        <span className="ba-toggle__btn-icon">▶</span>
      </button>
    </div>
  );
}
