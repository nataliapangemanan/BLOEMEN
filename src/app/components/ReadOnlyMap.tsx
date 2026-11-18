import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, ExternalLink, MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface ReadOnlyMapProps {
  latitude: number;
  longitude: number;
  shopName: string;
  height?: string;
  showOpenInMaps?: boolean;
}

export default function ReadOnlyMap({
  latitude,
  longitude,
  shopName,
  height = '300px',
  showOpenInMaps = true
}: ReadOnlyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fully interactive map — buyer can zoom (incl. scroll), drag, double-click zoom.
    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      zoomControl: true
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Shop marker — not draggable for buyers.
    const marker = L.marker([latitude, longitude], { draggable: false }).addTo(map);
    marker.bindPopup(`<strong>${shopName}</strong><br/>Lokasi Toko`).openPopup();

    setLoading(false);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, shopName]);

  const handleShowMyLocation = async () => {
    setGettingLocation(true);
    try {
      const { getCurrentPosition } = await import('../lib/geolocation');
      const { latitude: userLat, longitude: userLng } = await getCurrentPosition();
      if (mapRef.current) {
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([userLat, userLng]);
        } else {
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 2px #3b82f6;"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });
          userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon })
            .addTo(mapRef.current)
            .bindPopup('Lokasi Anda');
        }
        mapRef.current.flyToBounds(
          L.latLngBounds([latitude, longitude], [userLat, userLng]).pad(0.3),
          { duration: 1.2 }
        );
      }
      toast.success('Lokasi Anda ditampilkan di peta');
    } catch (err: any) {
      toast.error(err?.message || 'Gagal mendapatkan lokasi.');
    } finally {
      setGettingLocation(false);
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3">
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleShowMyLocation}
          disabled={gettingLocation}
          className="flex-1 py-2.5 px-4 bg-secondary text-foreground border border-border rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors text-sm font-medium disabled:opacity-60"
        >
          {gettingLocation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mendapatkan lokasi...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Lokasi Saya
            </>
          )}
        </button>
        {showOpenInMaps && (
          <button
            type="button"
            onClick={openInGoogleMaps}
            className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Navigation className="w-4 h-4" />
            Petunjuk Arah
          </button>
        )}
      </div>
    </div>
  );
}
