import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const DEFAULT_OFFICER = {
  id: 'OFF-4921',
  name: 'Er. Rajesh Sharma',
  role: 'officer', // 'officer' | 'public'
  designation: 'Executive Engineer (Hydro-GIS)',
  designationHi: 'अधिशासी अभियंता (जल-जीआईएस)',
  department: 'Catchment Engineering & Remote Sensing Division',
  departmentHi: 'जलसंभर अभियांत्रिकी एवं सुदूर संवेदन प्रभाग',
  email: 'r.sharma@hydro-gis.org',
  badgeColor: '#10b981',
};

export const DEFAULT_PUBLIC = {
  id: 'PUB-8812',
  name: 'Citizen Guest User',
  role: 'public',
  designation: 'Public Explorer / Researcher',
  designationHi: 'सार्वजनिक नागरिक / शोधकर्ता',
  department: 'Public Citizen Access Portal',
  departmentHi: 'सार्वजनिक नागरिक अवलोकन पोर्टल',
  email: 'citizen.guest@public-portal.org',
  badgeColor: '#38bdf8',
};

export function AuthProvider({ children }) {
  // Default to officer or retrieve from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wm_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved user', e);
    }
    return DEFAULT_OFFICER;
  });

  const loginAsOfficer = (officerData = {}) => {
    const user = { ...DEFAULT_OFFICER, ...officerData };
    setCurrentUser(user);
    localStorage.setItem('wm_auth_user', JSON.stringify(user));
  };

  const loginAsPublic = (publicData = {}) => {
    const user = { ...DEFAULT_PUBLIC, ...publicData };
    setCurrentUser(user);
    localStorage.setItem('wm_auth_user', JSON.stringify(user));
  };

  const logout = () => {
    // Default to public view upon logout
    setCurrentUser(DEFAULT_PUBLIC);
    localStorage.setItem('wm_auth_user', JSON.stringify(DEFAULT_PUBLIC));
  };

  const isOfficer = currentUser?.role === 'officer';
  const isPublic = currentUser?.role === 'public';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isOfficer,
        isPublic,
        loginAsOfficer,
        loginAsPublic,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
