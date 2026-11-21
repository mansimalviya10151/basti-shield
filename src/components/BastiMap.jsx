import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function MapClickHandler({ onSelectCoords }) {
  useMapEvents({
    click(e) {
      onSelectCoords([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

function MapFlyTo({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(coords, 14, { duration: 1.2 });
  }, [coords, map]);
  return null;
}

export default function BastiMap({
  anomalies,
  verifiedZones,
  coords,
  onSelectCoords,
  onSelectZone
}) {
  return (
    <MapContainer
      center={coords}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution="Esri World Imagery"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <MapClickHandler onSelectCoords={onSelectCoords} />
      <MapFlyTo coords={coords} />

      {anomalies.map((zone) => {
        const isVerified = verifiedZones[zone.id];
        return (
          <Circle
            key={zone.id}
            center={zone.coords}
            radius={zone.radius}
            pathOptions={{
              color: isVerified ? '#ef4444' : '#f59e0b',
              fillColor: isVerified ? '#ef4444' : '#f59e0b',
              fillOpacity: isVerified ? 0.35 : 0.2,
              dashArray: isVerified ? null : '6, 6'
            }}
            eventHandlers={{
              click: () => onSelectZone(zone)
            }}
          />
        );
      })}

      <Marker position={coords}>
        <Popup>
          <strong>Digital Address Anchor</strong>
          <br />
          Lat: {coords[0].toFixed(5)}
          <br />
          Lng: {coords[1].toFixed(5)}
        </Popup>
      </Marker>
    </MapContainer>
  );
}