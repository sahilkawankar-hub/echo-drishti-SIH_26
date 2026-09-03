import { useState, useCallback } from 'react';
import Navbar from './components/Navbar/Navbar';
import MapView from './components/MapView/MapView';
import LayerControls from './components/LayerControls/LayerControls';

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

  const handleToggleLayer = useCallback((key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <div className="app-layout">
      <Navbar layers={layers} onToggleLayer={handleToggleLayer} />

      <main className="app-main">
        <MapView layers={layers} />
        <LayerControls layers={layers} onToggleLayer={handleToggleLayer} />
      </main>
    </div>
  );
}
