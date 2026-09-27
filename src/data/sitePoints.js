import site001Photo from '../assets/site-photos/cement_nala_bund.jpg';

/**
 * Saved watershed work-sites for the Site Detail feature.
 * Each site represents a documented watershed intervention that an officer
 * has recorded with geo-coordinates and field photo.
 * Organized by locationId matching locations.js.
 */
const sitePoints = [
  /* ---------- Chandur Railway (Pilot Site) ---------- */
  {
    id: 'site-001',
    locationId: 'chandur-railway',
    lat: 20.8215,
    lng: 77.9782,
    siteName: 'Chandur Check Dam #4',
    completionPhotoUrl: site001Photo,
    completionDate: '2026-03-12',
    description: 'Masonry check dam constructed across primary drainage line to arrest monsoon runoff and recharge local groundwater aquifers.',
  },
  {
    id: 'site-002',
    locationId: 'chandur-railway',
    lat: 20.8145,
    lng: 77.9890,
    siteName: 'Railway Ridge Contour Trench – Sector A',
    completionPhotoUrl: 'https://placehold.co/400x260/1a2a3a/60a5fa?text=Contour+Trench+Done',
    completionDate: '2026-05-20',
    description: 'Continuous contour trenching and afforestation on upper ridge slopes to prevent soil erosion and improve vegetative cover.',
  },
  {
    id: 'site-003',
    locationId: 'chandur-railway',
    lat: 20.8280,
    lng: 77.9695,
    siteName: 'Amravati Farm Pond Cluster #8',
    completionPhotoUrl: 'https://placehold.co/400x260/2a2a1a/fbbf24?text=Farm+Pond+Completed',
    completionDate: '2026-06-18',
    description: 'Community farm pond with 3,200 m³ capacity supporting micro-irrigation for adjacent kharif agricultural plots.',
  },
  {
    id: 'site-004',
    locationId: 'chandur-railway',
    lat: 20.8180,
    lng: 77.9940,
    siteName: 'Nala Bunding & Recharge Pit – Block D',
    completionPhotoUrl: 'https://placehold.co/400x260/1e293b/38bdf8?text=Nala+Bund+Constructed',
    completionDate: '2026-04-10',
    description: 'Earthen bund with loose boulder structure designed to slow runoff velocity, trap silt, and improve water percolation.',
  },

  /* ---------- Hiware Bazar (Reference Case) ---------- */
  {
    id: 'hb-001',
    locationId: 'hiware-bazar',
    lat: 19.0748,
    lng: 74.0192,
    siteName: 'Hiware Bazar CCT & Afforestation Ridge',
    completionPhotoUrl: site001Photo,
    completionDate: '2024-05-15',
    description: 'Continuous contour trenching (CCT) and 40,000 tree ridge afforestation conserving seasonal rain runoff and restoring green canopy.',
  },
  {
    id: 'hb-002',
    locationId: 'hiware-bazar',
    lat: 19.0712,
    lng: 74.0170,
    siteName: 'Hiware Bazar Percolation Tank #1 (Bandhara)',
    completionPhotoUrl: 'https://placehold.co/400x260/134e4a/2dd4bf?text=Percolation+Tank',
    completionDate: '2024-08-20',
    description: 'Earthen percolation reservoir capturing seasonal runoff from the upper catchment to elevate village groundwater tables.',
  },

  /* ---------- Ralegan Siddhi (Reference Case) ---------- */
  {
    id: 'rs-001',
    locationId: 'ralegan-siddhi',
    lat: 19.1652,
    lng: 74.4315,
    siteName: 'Ralegan Siddhi Ridge Contour Bunding',
    completionPhotoUrl: site001Photo,
    completionDate: '2024-06-10',
    description: 'Ridge-to-valley contour earthen bunds and stone barriers arresting runoff velocity and promoting moisture retention.',
  },
  {
    id: 'rs-002',
    locationId: 'ralegan-siddhi',
    lat: 19.1628,
    lng: 74.4282,
    siteName: 'Ralegan Siddhi Check Dam & Nala Bund',
    completionPhotoUrl: 'https://placehold.co/400x260/1e3a8a/60a5fa?text=Check+Dam+Structure',
    completionDate: '2024-11-12',
    description: 'Masonry check dam constructed across primary drainage channel, retaining post-monsoon streamflow for community recharge.',
  },
];

export default sitePoints;
