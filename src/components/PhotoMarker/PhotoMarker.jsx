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
 * with a rich popup card that displays high-resolution camera and GSD metadata.
 *
 * @param {{ point: { id, lat, lng, photoUrl, locationName, insightText, status, resolution, gsd, sensor, focalLength, iso } }} props
 */
export default function PhotoMarker({ point }) {
  const {
    id,
    lat,
    lng,
    photoUrl,
    locationName,
    insightText,
    status,
    resolution = '4032 × 3024 (12.2 MP)',
    gsd = '2.4 cm/px Ground Sampling',
    sensor = 'Geotagged Survey Drone',
    focalLength = '26mm',
    iso = 'ISO 100',
  } = point;

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
      <Popup closeButton={true} maxWidth={320} minWidth={260}>
        <div className="photo-popup" id={`photo-popup-${id}`}>
          {/* Photo with Resolution Badge */}
          <div className="photo-popup__img-wrap">
            <img
              className="photo-popup__img"
              src={photoUrl}
              alt={`Survey photo — ${locationName}`}
              loading="lazy"
            />
            <span className="photo-popup__res-tag" title="Ground Survey Optical Resolution">
              📷 {resolution.split(' ')[0]} {resolution.includes('MP') ? resolution.match(/\((.*?)\)/)?.[1] : ''}
            </span>
          </div>

          {/* Body */}
          <div className="photo-popup__body">
            <span className="photo-popup__name">{locationName}</span>
            <span className="photo-popup__insight">{insightText}</span>

            {/* Resolution & Optical Specs Box */}
            <div className="photo-popup__specs">
              <div className="photo-popup__spec-row">
                <span className="photo-popup__spec-label">Image Resolution:</span>
                <span className="photo-popup__spec-val">{resolution}</span>
              </div>
              <div className="photo-popup__spec-row">
                <span className="photo-popup__spec-label">Ground Sampling (GSD):</span>
                <span className="photo-popup__spec-val photo-popup__spec-val--cyan">{gsd}</span>
              </div>
              <div className="photo-popup__spec-row">
                <span className="photo-popup__spec-label">Optical Sensor:</span>
                <span className="photo-popup__spec-val">{sensor} ({focalLength}, {iso})</span>
              </div>
            </div>

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
