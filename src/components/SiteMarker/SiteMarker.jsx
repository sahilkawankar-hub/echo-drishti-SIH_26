import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import './SiteMarker.css';

/**
 * Creates a Leaflet DivIcon styled as a blue teardrop pin for saved sites.
 */
function createSiteIcon() {
  return L.divIcon({
    className: 'site-marker-icon',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
    html: `
      <div class="site-marker-icon__pin">
        <span class="site-marker-icon__body">
          <span class="site-marker-icon__center"></span>
        </span>
        <span class="site-marker-icon__shadow"></span>
      </div>
    `,
  });
}

/**
 * Renders a single saved watershed site on the map as a pin marker.
 * Clicking the marker calls `onSelect` with the site data so the
 * parent can open the SiteDetailPanel.
 *
 * @param {{ site: object, onSelect: (site: object) => void }} props
 */
export default function SiteMarker({ site, onSelect }) {
  const icon = useMemo(() => createSiteIcon(), []);

  return (
    <Marker
      position={[site.lat, site.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(site),
      }}
    />
  );
}
