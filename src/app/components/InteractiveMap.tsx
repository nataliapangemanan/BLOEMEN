import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface InteractiveMapProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
  disabled?: boolean;
}

export default function InteractiveMap({
  latitude,
  longitude,
  onLocationChange,
  height = '300px',
  disabled = false
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Default location (Jakarta)
  const defaultLat = latitude || -6.2088;
  const defaultLng = longitude || 106.8456;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add initial marker
    const marker = L.marker([defaultLat, defaultLng], {
      draggable: true
    }).addTo(map);
    markerRef.current = marker;

    // Update position on drag
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onLocationChange(position.lat, position.lng);
      toast.success('Lokasi diperbarui');
    });

    // Update position on click
    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      toast.success('Lokasi dipilih');
    });

    setLoading(false);

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      if (mapRef.current) {
        mapRef.current.setView([latitude, longitude], 13);
      }
    }
  }, [latitude, longitude]);

  const handleGetCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { getCurrentPosition } = await import('../lib/geolocation');
      const { latitude, longitude } = await getCurrentPosition();
      if (markerRef.current) markerRef.current.setLatLng([latitude, longitude]);
      if (mapRef.current) mapRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });
      onLocationChange(latitude, longitude);
      toast.success('Lokasi berhasil dideteksi!');
    } catch (err: any) {
      console.error('Geolocation error:', err);
      toast.error(err?.message || 'Gagal mendapatkan lokasi.');
    } finally {
      setGettingLocation(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={gettingLocation || disabled}
          className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          {gettingLocation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mendapatkan lokasi...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Gunakan Lokasi Saya
            </>
          )}
        </button>
      </div>

      <div 
        ref={mapContainerRef} 
        style={{ height, width: '100%' }}
        className="rounded-xl overflow-hidden border-2 border-border relative"
      >
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Memuat peta...</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 <strong>Tips:</strong> Klik pada peta atau drag marker untuk menentukan lokasi toko Anda. Anda juga bisa menggunakan tombol "Gunakan Lokasi Saya" untuk otomatis mendeteksi lokasi.
        </p>
      </div>

      {latitude && longitude && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
            ✓ Lokasi Tersimpan
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            Latitude: {latitude.toFixed(6)}<br />
            Longitude: {longitude.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
}