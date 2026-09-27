import React, { createContext, useContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const translations = {
  en: {
    // Institutional Banner & Identity (No Country Names/Symbols)
    govTitle: 'HYDROLOGICAL SURVEY & GEO-SPATIAL AUDIT',
    ministryTitle: 'DIRECTORATE OF WATER RESOURCES',
    deptTitle: 'Geospatial Remote Sensing & Watershed Monitoring Division',
    portalName: 'eco_drishti • WATERSHED PORTAL',
    subPortalName: 'Satellite Remote Sensing & Hydro-Audit Information System',
    pilotBadge: 'PILOT STUDY BASIN',
    officialOfficer: 'Er. Rajesh Sharma',
    officerRole: 'Executive Engineer (Hydro-GIS)',
    systemLive: 'SYSTEM ACTIVE',
    version: 'Geo-GIS v3.1',
    portalTagline: 'Catchment Conservation & Satellite Geospatial System',

    // Authentication & Role Management
    signIn: 'Sign In',
    signOut: 'Sign Out',
    officerPortal: 'Officer Access',
    publicPortal: 'Public Access',
    switchRole: 'Switch Role / Re-login',
    officerRoleLabel: 'Department Officer & Engineer',
    publicRoleLabel: 'Public Citizen / Explorer',
    loginTitle: 'Watershed Portal Access & Authentication',
    loginSub: 'Select authorization tier to access GIS dashboard and ground telemetry',
    officerDesc: 'Full Administrative Privilege: Edit GIS markers, verify field inspections, update reservoir targets, and sanction disbursements.',
    publicDesc: 'Public Explorer View: Examine multi-spectral imagery, search administrative boundaries, measure distances, and review water health.',
    loginBtnOfficer: 'Sign In as Department Officer',
    loginBtnPublic: 'Continue as Public Citizen',
    permissionOfficerActive: 'Full Administrative & Edit Mode Enabled',
    permissionPublicActive: 'Public Explorer (View-Only Mode)',
    loginPageBack: '← Back to Monitoring Portal',
    editModeBadge: 'EDIT MODE',
    viewOnlyBadge: 'VIEW ONLY',
    authNotice: 'Institutional Access Logged for Audit Verification',

    // Sidebar
    navTitle: 'NAVIGATION MENU',
    navOverview: 'Overview Dashboard',
    navMap: 'GIS Satellite Map',
    navQueue: 'Field Verification Queue',
    navReports: 'Disbursements & Audit',
    navLogin: 'Account & Sign In',
    telemetryTitle: 'SATELLITE DOWNLINK',
    telemetrySynced: 'Multi-Spectral Telemetry Active',
    telemetryStatus: 'GIS Core Server Operational',

    // Dashboard Overview
    blockCatchment: 'CATCHMENT MONITORING JURISDICTION • Chandur Railway, Amravati District, Maharashtra',
    overviewHeading: 'Watershed Performance & Ground Audit Summary',
    syncInfo: 'Sentinel-2 Satellite Sync: Today, 08:30 AM',
    reAnalyzeBtn: 'Re-Analyze Catchment',
    analyzingBtn: 'Processing Satellite Bands...',
    analyzeSuccess: 'Catchment Data Refreshed',

    // Rebuilt KPI Metrics from Real Data (PS26015)
    kpiSitesTitle: 'SITES MONITORED',
    kpiSitesUnit: 'Registered Watersheds',
    kpiSitesPilot: '1 Pilot Basin',
    kpiSitesRef: '2 Reference Basins',
    kpiSitesPhotoFlag: 'Sites with Photo Geotags',
    kpiSitesStructureFlag: 'Sites with Physical Assets',
    kpiSitesBoundaryFlag: 'Sites with GeoJSON Boundary',

    kpiVerifTitle: 'VERIFICATION STATUS',
    kpiVerifDesc: 'Remote Sensing Spectral Verification',
    kpiVerifMatch: 'Match',
    kpiVerifMismatch: 'Mismatch',
    kpiVerifPending: 'Pending Analysis',

    kpiNdviTitle: 'NDVI CHANGE (VEGETATION)',
    kpiNdviUnit: 'Computed Spectral Delta',
    kpiNdviSub: 'Computed difference between Sentinel-2 Before & After imagery',
    kpiNdviAnalysisPending: 'Analysis pending',

    kpiBacklogTitle: 'VERIFICATION BACKLOG REDUCTION',
    kpiBacklogUnit: 'Field Submissions',
    kpiBacklogHeadline: 'field submissions auto cross-checked against satellite data',
    kpiBacklogTag: 'Demo scenario • Pilot Basin',
    kpiBacklogUsp: 'Automates Drishti (field photos) ↔ Srishti (satellite change detection)',

    registeredSitesHeading: 'Monitored Watershed Sites & Verification Pipeline',
    recentSubmissionsHeading: 'Ground-Truth Submissions & Verification Log',
    awaitingNdvi: 'Awaiting NDVI analysis',
    inspectOnMap: 'Inspect on GIS Map →',
    demoScenarioTag: 'Demo scenario',
    pilotSiteTag: 'Pilot Study Basin',
    referenceSiteTag: 'Reference Model',

    // Recent Alerts & Verification
    alertsHeading: 'Field Audit Alerts & Sensor Telemetry',
    viewAllQueue: 'View Complete Queue',
    assignTeamBtn: 'Assign Task Force',
    teamAssigned: 'Task Force Dispatched',

    // Items
    damName: 'Check Dam #07A',
    damLocation: 'Kolyari Basin Section',
    damDesc: 'Impoundment depth 2.4m verified via GIS satellite survey. Water retention matches baseline design.',
    damStatus: 'Field Verified & Operational',

    anicutName: 'Masonry Anicut #03',
    anicutLocation: 'Bakarol South Reach',
    anicutDesc: 'Hydraulic flow stable. Minor seepage recorded downstream. Structure structurally sound.',
    anicutStatus: 'Storage Level Normal',

    pondName: 'Community Farm Pond #12',
    pondLocation: 'Mamer Catchment',
    pondDesc: 'Physical geotag audit scheduled. Verification team deployed for volumetric survey.',
    pondStatus: 'Inspection Scheduled',

    plugName: 'Gully Plug Drainage Block #09',
    plugLocation: 'Malviya Stream Catchment',
    plugDesc: 'Silt deposition exceeded 35% threshold. Sluice valve flow restricted; desilting work needed.',
    plugStatus: 'Desilting Requisition Active',

    // Panchayat Storage
    panchayatHeading: 'Panchayat-wise Water Storage Index',
    panchayatSub: '4 Local Panchayats under Basin Jurisdiction',
    targetMet: 'All Basins Meeting Norms',
    targetImpoundment: 'Target: 75% Reservoir Impoundment Ratio',
    desiltNeeded: 'Desilt Work Requisitioned',

    // Map View & Resolution
    searchPlaceholder: 'Search any village, watershed, city, tehsil or range...',
    searching: 'Searching Boundary Registry...',
    noResultsFound: 'No boundary polygon found in registry. Please verify spelling.',
    searchError: 'Service connection failed. Please retry.',
    areaLabel: 'Surface Area',
    perimeterLabel: 'Boundary Perimeter',
    removeBoundary: 'Clear Boundary',
    activeBoundary: 'Active Boundary Line',
    imageryResolution: 'Sensor Resolution',
    gsdResolution: 'Ground Sampling (GSD)',
    photoResolutionLabel: 'Camera Resolution',

    // Map Types & Layers
    mapDetailsBtn: 'Map Layers & Imagery Sources',
    mapTypesTitle: 'Base Cartography Type',
    dataLayersTitle: 'Analytical Satellite Overlays',
    openSourcesAttribution: 'Sources: Multi-Spectral Satellite Feed, OpenStreetMap, CARTO, Esri GIS',
    measureDistanceBtn: 'Measure Geographic Distance',
    measureTitle: 'Geographic Distance Measurement',
    measureHint: 'Click on map points to measure survey distance',
    measureTotal: 'Total Distance',
    undoBtn: 'Undo Point',
    clearBtn: 'Clear',

    // Base Preset locations
    pilotBasinLabel: 'Reference Study Basin',
    pilotBasinPrefix: 'PILOT STUDY BASIN',
    pilotOptionLabel: 'Pilot Watersheds',
    refOptionLabel: 'Benchmark Study Basins',

    // Layer Controls
    vegLayer: 'Vegetation Health (NDVI)',
    waterLayer: 'Surface Water (NDWI)',
    landuseLayer: 'Land Use / Land Cover (LULC)',
    beforeDate: 'Baseline (Dec 2025)',
    afterDate: 'Recent (Jun 2026)',
    toggleBefore: 'Pre-Intervention',
    toggleAfter: 'Post-Intervention',

    // NEW FEATURES TRANSLATIONS
    // 1. Proposed Water Asset Pinning Tool
    addStructureBtn: 'Propose Water Asset',
    addStructureActive: 'Click Map to Pin Location',
    addStructureTitle: 'Propose New Water Conservation Asset',
    addStructureSub: 'Officer Cadre Direct Geotag & Engineering Entry',
    assetName: 'Asset Identification Name',
    assetType: 'Hydraulic Asset Type',
    assetCapacity: 'Design Storage Volume (ML)',
    assetBudget: 'Estimated Outlay (₹ Lakhs)',
    assetPanchayat: 'Jurisdiction Gram Panchayat',
    assetTargetDate: 'Target Commissioning Date',
    submitAssetProposal: 'Record Asset in Official Registry',
    assetPinnedSuccess: 'Proposed Water Asset Pinned to Basin Map!',

    // 2. Split Swipe Curtain Comparison
    swipeModeBtn: 'Curtain Swipe Comparison',
    toggleModeBtn: 'Pill Toggle Mode',
    swipeLeftLabel: '◀ Pre-Intervention (Dec 2025 Baseline)',
    swipeRightLabel: 'Post-Intervention (Jun 2026 Telemetry) ▶',
    swipeDragHint: 'Drag divider to compare baseline vs rejuvenated watershed',

    // 3. Elevation & Topography Profile
    elevationTitle: 'Catchment Topography & Elevation Profile',
    elevationBtn: 'Topography Profile',
    elevMax: 'Peak Elevation',
    elevMin: 'Valley Base',
    elevGain: 'Relief Range',
    elevSlope: 'Mean Slope',
    idealStructureHint: 'Recommendation: Check dam optimal at 380m-410m transition zone',

    // 4. Monsoon Rainfall Runoff Water Budget Simulator
    simulatorBtn: 'Runoff Budget Simulator',
    simulatorTitle: 'Monsoon Rainfall & Catchment Runoff Water Budget',
    rainfallInput: 'Precipitation Burst Intensity',
    soilTypeLabel: 'Soil Catchment Texture',
    soilHigh: 'Deep Sandy Loam (High Infiltration)',
    soilMed: 'Clay Loam / Silt (Moderate Absorption)',
    soilLow: 'Rocky Degraded Strata (High Runoff)',
    precipVolume: 'Total Precipitation Volume',
    soilRechargeVolume: 'Soil Aquifer Recharge',
    generatedRunoff: 'Effective Surface Runoff',
    capacityFilled: 'Total Storage Retention',
    overflowDischarge: 'Surplus Runoff Downstream',
    floodAlertLevel: 'Catchment Spate Warning',
    alertLow: 'Normal Absorption',
    alertMed: 'High Impoundment Inflow',
    alertHigh: 'Spillway Overflow Warning',

    // 5. Official Audit Dossier Export
    exportReportBtn: 'Export Official Dossier',
    exportGeoJson: 'Download GIS GeoJSON',
    exportCsv: 'Export Asset CSV',
    printDossier: 'Print Official Dossier (PDF)',
    dossierTitle: 'OFFICIAL WATERSHED AUDIT & TELEMETRY DOSSIER',
    dossierSub: 'Certified Geospatial Hydro-Audit Record',
    officerSignOff: 'Certified by Executive Engineer (Hydro-GIS)',

    // Common
    close: 'Close',
    active: 'Active',
    completed: 'Completed',
    status: 'Status',
    date: 'Date',
    action: 'Action',
  },

  hi: {
    // Institutional Banner & Identity (No Country Names/Symbols)
    govTitle: 'जल विज्ञान सर्वेक्षण एवं भू-स्थानिक अंकेक्षण',
    ministryTitle: 'जल संसाधन एवं जलसंभर प्रबंधन निदेशालय',
    deptTitle: 'भू-स्थानिक सुदूर संवेदन एवं जल अंकेक्षण प्रभाग',
    portalName: 'eco_drishti • जलसंभर निगरानी पोर्टल',
    subPortalName: 'उपग्रह सुदूर संवेदन एवं जल लेखा परीक्षा सूचना प्रणाली',
    pilotBadge: 'पायलट अध्ययन बेसिन',
    officialOfficer: 'ई. राजेश शर्मा',
    officerRole: 'अधिशासी अभियंता (जल-जीआईएस)',
    systemLive: 'प्रणाली सक्रिय',
    version: 'जियो-जीआईएस v3.1',
    portalTagline: 'जलसंभर संरक्षण एवं भू-स्थानिक अंकेक्षण प्रणाली',

    // Authentication & Role Management
    signIn: 'लॉगिन',
    signOut: 'लॉग आउट',
    officerPortal: 'अधिकारी पहुंच',
    publicPortal: 'सार्वजनिक पहुंच',
    switchRole: 'भूमिका बदलें / पुनः लॉगिन',
    officerRoleLabel: 'विभागीय अधिकारी एवं अभियंता',
    publicRoleLabel: 'सार्वजनिक नागरिक / शोधकर्ता',
    loginTitle: 'जलसंभर पोर्टल पहुंच एवं प्रमाणीकरण',
    loginSub: 'जीआईएस डैशबोर्ड एवं जमीनी टेलीमेट्री देखने हेतु प्राधिकार स्तर चुनें',
    officerDesc: 'पूर्ण प्रशासनिक अधिकार: जीआईएस मार्कर जोड़ें/संपादित करें, क्षेत्र सत्यापन स्वीकृत करें, जलाशय लक्ष्य बदलें एवं संवितरण जारी करें।',
    publicDesc: 'सार्वजनिक नागरिक पहुंच: उपग्रह परतें देखें, जल उपलब्धता जांचें, प्रशासनिक सीमाएं खोजें एवं दूरियां मापें (केवल अवलोकन)।',
    loginBtnOfficer: 'विभागीय अधिकारी के रूप में लॉगिन करें',
    loginBtnPublic: 'सार्वजनिक नागरिक के रूप में जारी रखें',
    permissionOfficerActive: 'पूर्ण प्रशासनिक एवं संपादन मोड सक्रिय',
    permissionPublicActive: 'सार्वजनिक नागरिक (केवल अवलोकन मोड)',
    loginPageBack: '← निगरानी पोर्टल पर वापस जाएं',
    editModeBadge: 'संपादन मोड',
    viewOnlyBadge: 'केवल अवलोकन',
    authNotice: 'अंकेक्षण सत्यापन हेतु संस्थागत लॉगिन दर्ज किया गया',

    // Sidebar
    navTitle: 'मुख्य नेविगेशन',
    navOverview: 'डैशबोर्ड अवलोकन',
    navMap: 'जीआईएस उपग्रह मानचित्र',
    navQueue: 'क्षेत्र सत्यापन कतार',
    navReports: 'संवितरण एवं अंकेक्षण',
    navLogin: 'खाता एवं लॉगिन',
    telemetryTitle: 'उपग्रह टेलीमेट्री',
    telemetrySynced: 'मल्टी-स्पेक्ट्रल उपग्रह लिंक सक्रिय',
    telemetryStatus: 'जीआईएस कोर सर्वर सुचारू',

    // Dashboard Overview
    blockCatchment: 'जलसंभर निगरानी क्षेत्राधिकार • चांदुर रेलवे, अमरावती जिला, महाराष्ट्र',
    overviewHeading: 'जलसंभर कार्यप्रणाली एवं जमीनी सत्यापन सारांश',
    syncInfo: 'सेंटिनल-2 उपग्रह अद्यतन: आज, 08:30 पूर्वाह्न',
    reAnalyzeBtn: 'क्षेत्र का पुनः विश्लेषण करें',
    analyzingBtn: 'उपग्रह डेटा विश्लेषित हो रहा है...',
    analyzeSuccess: 'जलसंभर डेटा अद्यतन सफल',

    // Rebuilt KPI Metrics from Real Data (PS26015)
    kpiSitesTitle: 'निगरानी किए जा रहे स्थल',
    kpiSitesUnit: 'पंजीकृत जलसंभर स्थल',
    kpiSitesPilot: '1 पायलट बेसिन',
    kpiSitesRef: '2 संदर्भ बेसिन',
    kpiSitesPhotoFlag: 'जियोटैग फोटो मार्कर युक्त स्थल',
    kpiSitesStructureFlag: 'भौतिक संरचना मार्कर युक्त स्थल',
    kpiSitesBoundaryFlag: 'भू-स्थानिक सीमा बहुभुज युक्त स्थल',

    kpiVerifTitle: 'सत्यापन स्थिति (एनडीवीआई)',
    kpiVerifDesc: 'रिमोट सेंसिंग स्पेक्ट्रल सत्यापन',
    kpiVerifMatch: 'सफल मिलान (Match)',
    kpiVerifMismatch: 'विसंगति (Mismatch)',
    kpiVerifPending: 'विश्लेषण प्रक्रियाधीन',

    kpiNdviTitle: 'एनडीवीआई परिवर्तन (वनस्पति सूचकांक)',
    kpiNdviUnit: 'गणना किया गया स्पेक्ट्रल डेल्टा',
    kpiNdviSub: 'सेंटिनल-2 पूर्व एवं पश्चात छवियों का वास्तविक अंतर',
    kpiNdviAnalysisPending: 'विश्लेषण प्रक्रियाधीन',

    kpiBacklogTitle: 'सत्यापन गति एवं बैकलॉग निवारण',
    kpiBacklogUnit: 'जमीनी प्रविष्टियां',
    kpiBacklogHeadline: 'क्षेत्र प्रविष्टियों का उपग्रह डेटा से स्वतः मिलान',
    kpiBacklogTag: 'प्रदर्शनात्मक परिदृश्य • पायलट बेसिन',
    kpiBacklogUsp: 'दृष्टि (जियोटैग फोटो) एवं सृष्टि (उपग्रह बदलाव पहचान) का स्वचालित समन्वय',

    registeredSitesHeading: 'पंजीकृत जलसंभर स्थल एवं उपग्रह सत्यापन स्थिति',
    recentSubmissionsHeading: 'जमीनी प्रविष्टियां एवं सत्यापन लॉग',
    awaitingNdvi: 'एनडीवीआई विश्लेषण प्रतीक्षित',
    inspectOnMap: 'जीआईएस मानचित्र पर देखें →',
    demoScenarioTag: 'प्रदर्शनात्मक परिदृश्य',
    pilotSiteTag: 'पायलट अध्ययन बेसिन',
    referenceSiteTag: 'संदर्भ मॉडल',

    // Recent Alerts & Verification
    alertsHeading: 'क्षेत्र सत्यापन चेतावनी एवं सेंसर टेलीमेट्री',
    viewAllQueue: 'संपूर्ण कतार देखें',
    assignTeamBtn: 'कार्यदल नियुक्त करें',
    teamAssigned: 'कार्यदल प्रेषित',

    // Items
    damName: 'चेक डैम #07A',
    damLocation: 'कोल्यारी बेसिन खंड',
    damDesc: 'जीआईएस उपग्रह सर्वेक्षण द्वारा 2.4 मीटर जल भराव सत्यापित। जल धारण क्षमता मानक के अनुरूप।',
    damStatus: 'सत्यापित एवं कार्यशील',

    anicutName: 'चिनाई अनिकट #03',
    anicutLocation: 'बाकरोल दक्षिण पहुंच',
    anicutDesc: 'प्रवाह क्षमता स्थिर। अनुप्रवाह में सामान्य रिसाव दर्ज। संरचनात्मक रूप से सुरक्षित।',
    anicutStatus: 'जल भंडारण सामान्य',

    pondName: 'सामुदायिक खेत तालाब #12',
    pondLocation: 'मामेर जलसंभर',
    pondDesc: 'भौतिक जियोटैग अंकेक्षण निर्धारित। सत्यापन दल आयतन माप हेतु तैनात।',
    pondStatus: 'निरीक्षण निर्धारित',

    plugName: 'गली प्लग जल निकासी ब्लॉक #09',
    plugLocation: 'मालवीय धारा जलसंभर',
    plugDesc: 'गाद जमाव 35% सीमा से अधिक। जल निकासी वॉल्व अवरुद्ध; गाद सफाई कार्य अपेक्षित।',
    plugStatus: 'गाद निष्कासन अपेक्षित',

    // Panchayat Storage
    panchayatHeading: 'पंचायत-वार जल भंडारण सूचकांक',
    panchayatSub: 'जलसंभर प्रबंधन के अंतर्गत 4 स्थानीय पंचायतें',
    targetMet: 'सभी बेसिन लक्ष्य के अनुरूप',
    targetImpoundment: 'लक्ष्य: 75% जलाशय जल धारण दर',
    desiltNeeded: 'गाद सफाई कार्य संस्तुत',

    // Map View & Resolution
    searchPlaceholder: 'किसी भी गाँव, जलसंभर, शहर, तहसील अथवा सीमा को खोजें...',
    searching: 'सीमा पंजीयन में खोज जारी...',
    noResultsFound: 'कोई सीमा बहुभुज प्राप्त नहीं हुआ। कृपया वर्तनी जाँचें।',
    searchError: 'सर्वर संपर्क त्रुटि। कृपया पुनः प्रयास करें।',
    areaLabel: 'कुल क्षेत्रफल',
    perimeterLabel: 'परिधि सीमा',
    removeBoundary: 'सीमा रेखा हटाएं',
    activeBoundary: 'सक्रिय सीमा रेखा',
    imageryResolution: 'सेंसर रिज़ॉल्यूशन',
    gsdResolution: 'धरातलीय नमूना दूरी (GSD)',
    photoResolutionLabel: 'कैमरा रिज़ॉल्यूशन',

    // Map Types & Layers
    mapDetailsBtn: 'मानचित्र परतें एवं उपग्रह स्रोत',
    mapTypesTitle: 'मूल मानचित्र प्रकार',
    dataLayersTitle: 'विश्लेषणात्मक उपग्रह परतें',
    openSourcesAttribution: 'स्रोत: मल्टी-स्पेक्ट्रल उपग्रह डेटा, ओपन-स्ट्रीट-मैप, कार्टो, एसरी जीआईएस',
    measureDistanceBtn: 'भौगोलिक दूरी मापें',
    measureTitle: 'भौगोलिक दूरी मापन यंत्र',
    measureHint: 'सर्वेक्षण दूरी मापने हेतु मानचित्र पर क्लिक करें',
    measureTotal: 'कुल दूरी',
    undoBtn: 'पूर्ववत करें',
    clearBtn: 'साफ़ करें',

    // Base Preset locations
    pilotBasinLabel: 'संदर्भित अध्ययन बेसिन',
    pilotBasinPrefix: 'पायलट अध्ययन बेसिन',
    pilotOptionLabel: 'पायलट जलसंभर',
    refOptionLabel: 'मानक अध्ययन बेसिन',

    // Layer Controls
    vegLayer: 'वनस्पति स्वास्थ्य (NDVI)',
    waterLayer: 'सतही जल निकाय (NDWI)',
    landuseLayer: 'भूमि उपयोग / आवरण (LULC)',
    beforeDate: 'आधार रेखा (दिसंबर 2025)',
    afterDate: 'अद्यतन (जून 2026)',
    toggleBefore: 'कार्य पूर्व',
    toggleAfter: 'कार्य पश्चात',

    // NEW FEATURES TRANSLATIONS
    // 1. Proposed Water Asset Pinning Tool
    addStructureBtn: 'नई संरचना प्रस्तावित करें',
    addStructureActive: 'स्थल चिन्हित करने हेतु मानचित्र पर क्लिक करें',
    addStructureTitle: 'नई जल संरक्षण संरचना का प्रस्ताव',
    addStructureSub: 'अधिकारी संवर्ग प्रत्यक्ष जियोटैग एवं अभियांत्रिकी प्रविष्टि',
    assetName: 'संरचना का पहचान नाम',
    assetType: 'जल संरचना प्रकार',
    assetCapacity: 'डिज़ाइन संचयन क्षमता (ML)',
    assetBudget: 'अनुमानित व्यय (₹ लाख)',
    assetPanchayat: 'संबंधित ग्राम पंचायत',
    assetTargetDate: 'कार्य समाप्ति लक्षित तिथि',
    submitAssetProposal: 'शासकीय पंजीयन में प्रस्ताव दर्ज करें',
    assetPinnedSuccess: 'प्रस्तावित संरचना मानचित्र पर सफलतापूर्वक स्थापित!',

    // 2. Split Swipe Curtain Comparison
    swipeModeBtn: 'पर्दा स्वाइप तुलना मोड',
    toggleModeBtn: 'बटन टॉगल मोड',
    swipeLeftLabel: '◀ कार्य-पूर्व आधार रेखा (दिसंबर 2025)',
    swipeRightLabel: 'कार्य-पश्चात उपग्रह दृश्य (जून 2026) ▶',
    swipeDragHint: 'पुनर्जीवित जलसंभर तुलना हेतु विभाजक रेखा खींचें',

    // 3. Elevation & Topography Profile
    elevationTitle: 'जलसंभर उच्चावच एवं तुंगता प्रोफ़ाइल',
    elevationBtn: 'उच्चावच प्रोफ़ाइल',
    elevMax: 'शीर्ष ऊंचाई',
    elevMin: 'घाटी तल',
    elevGain: 'कुल उच्चावच विस्तार',
    elevSlope: 'औसत ढलान',
    idealStructureHint: 'सिफारिश: चेक डैम 380m-410m ढलान संक्रमण क्षेत्र हेतु उपयुक्त',

    // 4. Monsoon Rainfall Runoff Water Budget Simulator
    simulatorBtn: 'अपवाह बजट सिम्युलेटर',
    simulatorTitle: 'मानसून वर्षा अपवाह एवं जल बजट सिमुलेशन',
    rainfallInput: 'वर्षा बौछार तीव्रता (मिमी)',
    soilTypeLabel: 'मृदा अंतःस्रवण प्रकार',
    soilHigh: 'गहरी बलुई दोमट (उच्च अंतःस्रवण)',
    soilMed: 'चिकनी दोमट / गाद (मध्यम अंतःस्रवण)',
    soilLow: 'अपक्षयित चट्टानी क्षेत्र (अत्यधिक अपवाह)',
    precipVolume: 'कुल वर्षा जल आयतन',
    soilRechargeVolume: 'मृदा भूजल पुनर्भरण',
    generatedRunoff: 'उत्पन्न सतही अपवाह',
    capacityFilled: 'संरचनाओं द्वारा जल संचयन',
    overflowDischarge: 'अनुप्रवाह अतिरिक्त निकास',
    floodAlertLevel: 'जलप्रवाह चेतावनी स्तर',
    alertLow: 'सामान्य अंतःस्रवण',
    alertMed: 'जलाशय अंतर्वाह तीव्र',
    alertHigh: 'अतिरिक्त जलप्रवाह चेतावनी',

    // 5. Official Audit Dossier Export
    exportReportBtn: 'अंकेक्षण डॉसियर निर्यात',
    exportGeoJson: 'जीआईएस GeoJSON डाउनलोड',
    exportCsv: 'संपत्ति सूची (CSV) डाउनलोड',
    printDossier: 'अंकेक्षण डॉसियर प्रिंट (PDF)',
    dossierTitle: 'शासकीय जलसंभर अंकेक्षण एवं उपग्रह टेलीमेट्री डॉसियर',
    dossierSub: 'प्रमाणित भू-स्थानिक जल लेखा परीक्षा अभिलेख',
    officerSignOff: 'अधिशासी अभियंता (जल-जीआईएस) द्वारा प्रमाणित',

    // Common
    close: 'बंद करें',
    active: 'सक्रिय',
    completed: 'पूर्ण',
    status: 'स्थिति',
    date: 'दिनांक',
    action: 'कार्यवाही',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('wm_lang');
    if (saved && (saved === 'en' || saved === 'hi')) {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('wm_lang', newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
