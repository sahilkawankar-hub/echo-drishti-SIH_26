import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './PhotoMarker.css';

/**
 * Creates a Leaflet DivIcon with a coloured circular dot and a
 * radiating pulse ring whose colour depends on the point's status.
 */
function createMarkerIcon(status) {
  const modifier = status === 'confirmed' ? 'confirmed' : 'mismatch';

  return L.divIcon({
    className: 'photo-marker-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
    html: `
      <span class="photo-marker-icon__ring photo-marker-icon__ring--${modifier}"></span>
      <span class="photo-marker-icon__dot photo-marker-icon__dot--${modifier}"></span>
    `,
  });
}

/**
 * Renders a single photo survey point on the map as a custom marker
 * with a rich popup card.
 *
 * @param {{ point: { id, lat, lng, photoUrl, locationName, insightText, status } }} props
 */
export default function PhotoMarker({ point }) {
  const { id, lat, lng, photoUrl, locationName, insightText, status } = point;

  const icon = useMemo(() => createMarkerIcon(status), [status]);

  const isConfirmed = status === 'confirmed';
  const badgeModifier = isConfirmed ? 'confirmed' : 'mismatch';
  const badgeLabel = isConfirmed ? 'Confirmed' : 'Discrepancy';

  return (
    <Marker
      key={id}
      position={[lat, lng]}
      icon={icon}
    >
      <Popup closeButton={true} maxWidth={280} minWidth={240}>
        <div className="photo-popup" id={`photo-popup-${id}`}>
          {/* Photo */}
          <img
            className="photo-popup__img"
            src={photoUrl}
            alt={`Survey photo — ${locationName}`}
            loading="lazy"
          />

          {/* Body */}
          <div className="photo-popup__body">
            <span className="photo-popup__name">{locationName}</span>
            <span className="photo-popup__insight">{insightText}</span>

            {/* Status Badge */}
            <span className={`photo-popup__badge photo-popup__badge--${badgeModifier}`}>
              <span className="photo-popup__badge-dot" />
              {badgeLabel}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
