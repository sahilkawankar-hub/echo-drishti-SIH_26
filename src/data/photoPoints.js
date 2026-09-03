/**
 * Dummy photo survey points for testing map markers.
 * Each point represents a ground-truth observation within the watershed.
 *
 * TODO: Replace with real data from API or database.
 */
const photoPoints = [
  {
    id: 'pt-001',
    lat: 20.8240,
    lng: 77.9735,
    photoUrl: 'https://placehold.co/300x200/0f4c3a/34d399?text=Vegetation+Canopy',
    locationName: 'Upper Stream Riparian Buffer',
    insightText: 'Dense canopy recovery observed post-monsoon, matching NDVI increase of +0.34.',
    status: 'confirmed',
  },
  {
    id: 'pt-002',
    lat: 20.8162,
    lng: 77.9820,
    photoUrl: 'https://placehold.co/300x200/1a3a2a/34d399?text=Afforestation+Ridge',
    locationName: 'Ridge Top Afforestation Plot',
    insightText: 'Sapling survival rate high (~85%); satellite greenness index confirmed positive trend.',
    status: 'confirmed',
  },
  {
    id: 'pt-003',
    lat: 20.8295,
    lng: 77.9880,
    photoUrl: 'https://placehold.co/300x200/3b1a1a/f87171?text=Silt+Accumulation',
    locationName: 'Command Area North Gully',
    insightText: 'Satellite indicated moisture zone but ground survey reveals silt accumulation requiring desilting.',
    status: 'mismatch',
  },
  {
    id: 'pt-004',
    lat: 20.8105,
    lng: 77.9680,
    photoUrl: 'https://placehold.co/300x200/0c2d48/60a5fa?text=Drainage+Outlet',
    locationName: 'South Watershed Outlet Drain',
    insightText: 'Clear water discharge observed; turbidity levels reduced compared to pre-intervention baseline.',
    status: 'confirmed',
  },
  {
    id: 'pt-005',
    lat: 20.8210,
    lng: 77.9950,
    photoUrl: 'https://placehold.co/300x200/3b2a0a/fbbf24?text=Grazing+Impact',
    locationName: 'East Micro-Catchment Slope',
    insightText: 'Trench stabilization delayed due to cattle grazing; discrepancy with predicted biomass cover.',
    status: 'mismatch',
  },
];

export default photoPoints;
