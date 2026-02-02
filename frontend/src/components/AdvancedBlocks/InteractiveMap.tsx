import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface Marker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

interface InteractiveMapProps {
  title: string;
  center: { lat: number; lng: number };
  zoom?: number;
  markers: Marker[];
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  title,
  center,
  zoom = 13,
  markers = [],
  height = '400px',
}) => {
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  // Simple map implementation using div with background
  // In production, integrate with Google Maps, Mapbox, or Leaflet
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${center.lng},${center.lat},${zoom}/600x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;

  return (
    <div className="w-full py-20">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-slate-900">{title}</h2>
      </div>
      <div className="relative rounded-2xl overflow-hidden" style={{ height }}>
        <div
          className="w-full h-full bg-slate-200 relative"
          style={{
            backgroundImage: `url(${mapUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((marker.lng - center.lng) / 0.01) * 50 + 50}%`,
                top: `${((marker.lat - center.lat) / 0.01) * 50 + 50}%`,
              }}
              onClick={() => setSelectedMarker(marker)}
            >
              <MapPin className="w-8 h-8 text-red-500 fill-red-500" />
            </div>
          ))}
        </div>
        {selectedMarker && (
          <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-xl">
            <h3 className="font-bold text-slate-900">{selectedMarker.title}</h3>
            {selectedMarker.description && (
              <p className="text-sm text-slate-600 mt-1">{selectedMarker.description}</p>
            )}
            <button
              onClick={() => setSelectedMarker(null)}
              className="mt-2 text-xs text-blue-600 hover:underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

