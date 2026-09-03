import site001Photo from '../assets/site-photos/cement_nala_bund.jpg';

/**
 * Saved watershed work-sites for the Site Detail feature.
 * Each site represents a completed watershed intervention that an officer
 * has documented with a photo.
 */
const sitePoints = [
  {
    id: 'site-001',
    lat: 20.8215,
    lng: 77.9782,
    siteName: 'Chandur Check Dam #4',
    completionPhotoUrl: site001Photo,
    completionDate: '2026-03-12',
    description: 'Masonry check dam constructed across primary drainage line to arrest monsoon runoff and recharge local groundwater aquifers.',
  },
  {
    id: 'site-002',
    lat: 20.8145,
    lng: 77.9890,
    siteName: 'Railway Ridge Contour Trench – Sector A',
    completionPhotoUrl: 'https://placehold.co/400x260/1a2a3a/60a5fa?text=Contour+Trench+Done',
    completionDate: '2026-05-20',
    description: 'Continuous contour trenching and afforestation on upper ridge slopes to prevent soil erosion and improve vegetative cover.',
  },
  {
    id: 'site-003',
    lat: 20.8280,
    lng: 77.9695,
    siteName: 'Amravati Farm Pond Cluster #8',
    completionPhotoUrl: 'https://placehold.co/400x260/2a2a1a/fbbf24?text=Farm+Pond+Completed',
    completionDate: '2026-06-18',
    description: 'Community farm pond with 3,200 m³ capacity supporting micro-irrigation for adjacent kharif agricultural plots.',
  },
  {
    id: 'site-004',
    lat: 20.8180,
    lng: 77.9940,
    siteName: 'Nala Bunding & Recharge Pit – Block D',
    completionPhotoUrl: 'https://placehold.co/400x260/1e293b/38bdf8?text=Nala+Bund+Constructed',
    completionDate: '2026-04-10',
    description: 'Earthen bund with loose boulder structure designed to slow runoff velocity, trap silt, and improve water percolation.',
  },
];

export default sitePoints;
