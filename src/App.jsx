import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import Navbar from './components/Navbar/Navbar';
import MapView from './components/MapView/MapView';
import LayerControls from './components/LayerControls/LayerControls';
import { DEFAULT_LOCATION_ID } from './data/locations';

/**
 * Root application component.
 * Features sidebar navigation, rich satellite background, and multi-view orchestration
 * between the executive Dashboard Overview and GIS Map View.
 */
export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  const [layers, setLayers] = useState({
    vegetation: true,
    water: false,
    landuse: false,
  });

  const [activeLocationId, setActiveLocationId] = useState(DEFAULT_LOCATION_ID);

  const handleToggleLayer = useCallback((key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleLocationChange = useCallback((id) => {
    setActiveLocationId(id);
    setSelectedSite(null);
    setSelectedSiteId(null);
  }, []);

  const handleNavigateToMap = useCallback((siteId) => {
    if (siteId) {
      setSelectedSiteId(siteId);
    }
    setActiveView('map');
  }, []);

  return (
    <>
      {/* Subtle Satellite Aerial Background */}
      <div className="app-satellite-bg" aria-hidden="true" />

      <div className="app-layout">
        {/* Left Navigation Sidebar */}
        <Sidebar activeView={activeView} onSelectView={setActiveView} />

        {/* Main Content Area */}
        <div className="app-content-area">
          {activeView === 'overview' && (
            <main className="app-main">
              <DashboardOverview onNavigateToMap={handleNavigateToMap} />
            </main>
          )}

          {activeView === 'map' && (
            <>
              <Navbar layers={layers} onToggleLayer={handleToggleLayer} />
              <main className="app-main" style={{ overflow: 'hidden' }}>
                <MapView
                  layers={layers}
                  activeLocationId={activeLocationId}
                  selectedSite={selectedSite}
                  onSelectSite={setSelectedSite}
                  initialSiteId={selectedSiteId}
                />
                <LayerControls
                  layers={layers}
                  onToggleLayer={handleToggleLayer}
                  activeLocationId={activeLocationId}
                  onLocationChange={handleLocationChange}
                  isPanelOpen={!!selectedSite}
                />
              </main>
            </>
          )}

          {activeView === 'queue' && (
            <main className="app-main">
              <DashboardOverview onNavigateToMap={handleNavigateToMap} />
            </main>
          )}

          {activeView === 'reports' && (
            <main className="app-main">
              <DashboardOverview onNavigateToMap={handleNavigateToMap} />
            </main>
          )}
        </div>
      </div>
    </>
  );
}
