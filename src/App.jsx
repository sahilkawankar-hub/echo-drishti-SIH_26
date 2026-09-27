import { useState, useCallback } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import GovHeader from './components/GovHeader/GovHeader';
import Sidebar from './components/Sidebar/Sidebar';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import VerificationQueue from './components/VerificationQueue/VerificationQueue';
import LoginPage from './components/LoginPage/LoginPage';
import Navbar from './components/Navbar/Navbar';
import MapView from './components/MapView/MapView';
import LayerControls from './components/LayerControls/LayerControls';
import { DEFAULT_LOCATION_ID } from './data/locations';

/**
 * Root application component wrapped in LanguageProvider & AuthProvider.
 * Features institutional geospatial header, sidebar navigation,
 * dedicated login page with Officer & Public tiers, and GIS Map View.
 */
function AppContent() {
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

  const handleNavigateToMap = useCallback((siteId, locationId) => {
    if (locationId) {
      setActiveLocationId(locationId);
    }
    if (siteId) {
      setSelectedSiteId(siteId);
    }
    setActiveView('map');
  }, []);

  const handleNavigateToLogin = useCallback(() => {
    setActiveView('login');
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
          {/* Top Institutional Header with Auth Bar (hidden on GIS Map view) */}
          {activeView !== 'map' && (
            <GovHeader onNavigateToLogin={handleNavigateToLogin} />
          )}

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
              <VerificationQueue onNavigateToMap={handleNavigateToMap} />
            </main>
          )}

          {activeView === 'login' && (
            <main className="app-main">
              <LoginPage onBackToPortal={() => setActiveView('overview')} />
            </main>
          )}
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
