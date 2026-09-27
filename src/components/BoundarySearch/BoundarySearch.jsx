import { useState, useRef, useEffect, useCallback } from 'react';
import './BoundarySearch.css';
import { calculateArea, calculatePerimeter, getBoundsFromGeoJSON } from '../../utils/geoUtils';
import { useLanguage } from '../../context/LanguageContext';

/**
 * BoundarySearch — Official administrative & watershed boundary search.
 * Searches national OpenStreetMap / Survey databases for villages,
 * watersheds, tehsils, districts, and forest ranges.
 *
 * @param {{
 *   onBoundaryFound: (geojson: object, info: object, bounds: number[][]) => void,
 *   onBoundaryCleared: () => void,
 * }} props
 */
export default function BoundarySearch({ onBoundaryFound, onBoundaryCleared }) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeResult, setActiveResult] = useState(null);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  /**
   * Debounced search — queries Nominatim after 400ms.
   */
  const searchNominatim = useCallback((searchText) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!searchText || searchText.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const encoded = encodeURIComponent(searchText.trim());
        const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&polygon_geojson=1&limit=8&countrycodes=in&addressdetails=1`;

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'NationalWatershedPortal/2.0 (nic-in)',
          },
        });

        if (!response.ok) throw new Error('Search failed');

        const data = await response.json();

        // Filter to results that have polygon boundaries
        const filtered = data.filter(
          (r) =>
            r.geojson &&
            (r.geojson.type === 'Polygon' ||
              r.geojson.type === 'MultiPolygon' ||
              r.geojson.type === 'GeometryCollection')
        );

        setSuggestions(filtered);
      } catch (err) {
        console.error('Boundary search error:', err);
        setError(t.searchError);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);
  }, [t.searchError]);

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchNominatim(value);
  };

  /**
   * Handle selecting a search result — extracts boundary and notifies parent.
   */
  const handleSelectResult = useCallback(
    (result) => {
      setIsFocused(false);
      setSuggestions([]);
      setQuery(result.display_name.split(',')[0]);

      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: result.geojson,
            properties: {
              name: result.display_name,
              type: result.type,
              class: result.class,
              osm_id: result.osm_id,
            },
          },
        ],
      };

      const area = calculateArea(geojson);
      const perimeter = calculatePerimeter(geojson);
      const bounds = getBoundsFromGeoJSON(geojson);
      const typeLabel = getTypeLabel(result, lang);

      const info = {
        name: result.display_name.split(',')[0],
        fullName: result.display_name,
        type: typeLabel,
        osmType: result.osm_type,
        area: area,
        perimeter: perimeter,
        boundingBox: result.boundingbox,
      };

      setActiveResult(info);
      onBoundaryFound(geojson, info, bounds);
    },
    [onBoundaryFound, lang]
  );

  /**
   * Clear the active boundary and reset search.
   */
  const handleClear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setActiveResult(null);
    setError(null);
    onBoundaryCleared();
    inputRef.current?.focus();
  }, [onBoundaryCleared]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="boundary-search" ref={containerRef} id="boundary-search">
      {/* ---- Search Input Bar (Official GIS Search Style) ---- */}
      <div
        className={`boundary-search__bar${isFocused ? ' boundary-search__bar--focused' : ''}${
          activeResult ? ' boundary-search__bar--has-result' : ''
        }`}
      >
        <span className="boundary-search__icon" aria-hidden="true">
          {isLoading ? (
            <span className="boundary-search__spinner" />
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          )}
        </span>

        <input
          ref={inputRef}
          type="text"
          className="boundary-search__input"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          id="boundary-search-input"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {(query || activeResult) && (
          <button
            className="boundary-search__clear"
            onClick={handleClear}
            title={t.clearBtn}
            id="boundary-search-clear"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {/* ---- Autocomplete Suggestions ---- */}
      {isFocused && suggestions.length > 0 && (
        <div className="boundary-search__dropdown" id="boundary-search-dropdown">
          {suggestions.map((result, index) => (
            <button
              key={`${result.osm_id}-${index}`}
              className="boundary-search__suggestion"
              onClick={() => handleSelectResult(result)}
              id={`boundary-suggestion-${index}`}
              type="button"
            >
              <span className="boundary-search__suggestion-icon">
                {getTypeIcon(result)}
              </span>
              <span className="boundary-search__suggestion-body">
                <span className="boundary-search__suggestion-name">
                  {result.display_name.split(',')[0]}
                </span>
                <span className="boundary-search__suggestion-detail">
                  {result.display_name.split(',').slice(1, 4).join(', ')}
                </span>
              </span>
              <span className="boundary-search__suggestion-type">
                {getTypeLabel(result, lang)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ---- No Results Message ---- */}
      {isFocused && query.length >= 2 && !isLoading && suggestions.length === 0 && !error && (
        <div className="boundary-search__dropdown boundary-search__dropdown--empty">
          <span className="boundary-search__no-results">{t.noResultsFound}</span>
        </div>
      )}

      {/* ---- Error Message ---- */}
      {error && (
        <div className="boundary-search__dropdown boundary-search__dropdown--error">
          <span className="boundary-search__error">{error}</span>
        </div>
      )}

      {/* ---- Active Boundary Info Card (ONLY SHOWN AFTER SEARCHING) ---- */}
      {activeResult && (
        <div className="boundary-info" id="boundary-info-card">
          <div className="boundary-info__header">
            <span className="boundary-info__pulse" />
            <span className="boundary-info__title">{activeResult.name}</span>
            <span className="boundary-info__type">{activeResult.type}</span>
            <button
              className="boundary-info__close"
              onClick={handleClear}
              title={t.removeBoundary}
              id="boundary-info-close"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="boundary-info__stats">
            <div className="boundary-info__stat">
              <span className="boundary-info__stat-icon">📐</span>
              <div className="boundary-info__stat-body">
                <span className="boundary-info__stat-value">
                  {activeResult.area < 1
                    ? `${(activeResult.area * 1000000).toFixed(0)} m²`
                    : `${activeResult.area.toFixed(2)} km²`}
                </span>
                <span className="boundary-info__stat-label">{t.areaLabel}</span>
              </div>
            </div>

            <div className="boundary-info__stat">
              <span className="boundary-info__stat-icon">📏</span>
              <div className="boundary-info__stat-body">
                <span className="boundary-info__stat-value">
                  {activeResult.perimeter < 1
                    ? `${(activeResult.perimeter * 1000).toFixed(0)} m`
                    : `${activeResult.perimeter.toFixed(2)} km`}
                </span>
                <span className="boundary-info__stat-label">{t.perimeterLabel}</span>
              </div>
            </div>
          </div>

          <div className="boundary-info__full-name" title={activeResult.fullName}>
            📍 {activeResult.fullName}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Helpers with Hindi translation support ---- */

function getTypeLabel(result, lang = 'en') {
  const isHi = lang === 'hi';
  const typeMap = {
    village: isHi ? 'ग्राम / गाँव' : 'Village',
    town: isHi ? 'कस्बा / नगर' : 'Town',
    city: isHi ? 'शहर / महानगर' : 'City',
    hamlet: isHi ? 'मजरा' : 'Hamlet',
    suburb: isHi ? 'उपनगर' : 'Suburb',
    county: isHi ? 'तहसील / जिला' : 'District / Tehsil',
    state: isHi ? 'राज्य' : 'State',
    administrative: isHi ? 'प्रशासनिक क्षेत्र' : 'Administrative Area',
    neighbourhood: isHi ? 'पड़ोस / क्षेत्र' : 'Neighbourhood',
    municipality: isHi ? 'नगर पालिका' : 'Municipality',
    river: isHi ? 'नदी / जलधारा' : 'River / Stream',
    water: isHi ? 'जलाशय' : 'Water Body',
    reservoir: isHi ? 'बाँध / जलाशय' : 'Reservoir',
    wetland: isHi ? 'आर्द्रभूमि' : 'Wetland',
    forest: isHi ? 'वन क्षेत्र / रेंज' : 'Forest / Range',
    national_park: isHi ? 'राष्ट्रीय उद्यान' : 'National Park',
    protected_area: isHi ? 'संरक्षित क्षेत्र' : 'Protected Area',
    boundary: isHi ? 'सीमा क्षेत्र' : 'Boundary Area',
  };

  return (
    typeMap[result.type] ||
    typeMap[result.class] ||
    result.type?.replace(/_/g, ' ') ||
    (isHi ? 'क्षेत्र' : 'Area')
  );
}

function getTypeIcon(result) {
  const icons = {
    village: '🏘️',
    town: '🏢',
    city: '🏛️',
    hamlet: '🏡',
    county: '📍',
    state: '🗺️',
    river: '🌊',
    water: '💧',
    reservoir: '🏞️',
    forest: '🌲',
    national_park: '🌳',
  };
  return icons[result.type] || icons[result.class] || '📍';
}
