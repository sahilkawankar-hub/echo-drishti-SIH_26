import { useState, useCallback } from 'react';
import Navbar from './components/Navbar/Navbar';
import MapView from './components/MapView/MapView';
import LayerControls from './components/LayerControls/LayerControls';
import { DEFAULT_LOCATION_ID } from './data/locations';

/**
 * Root application component.
 * Manages shared layer-visibility state and composes the layout.
 */
export default function App() {
  const [layers, setLayers] = useState({
    vegetation: false,
    water: false,
    landuse: false,
  });

  const [activeLocationId, setActiveLocationId] = useState(DEFAULT_LOCATION_ID);
  const [selectedSite, setSelectedSite] = useState(null);

  const handleToggleLayer = useCallback((key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleLocationChange = useCallback((id) => {
    setActiveLocationId(id);
    setSelectedSite(null);
  }, []);

  return (
    <div className="app-layout">
      <Navbar layers={layers} onToggleLayer={handleToggleLayer} />

      <main className="app-main">
        <MapView
          layers={layers}
          activeLocationId={activeLocationId}
          selectedSite={selectedSite}
          onSelectSite={setSelectedSite}
        />
        <LayerControls
          layers={layers}
          onToggleLayer={handleToggleLayer}
          activeLocationId={activeLocationId}
          onLocationChange={handleLocationChange}
          isPanelOpen={!!selectedSite}
        />
      </main>
    </div>
  );
}

