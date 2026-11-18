import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { getShopById } from '../lib/api';
import { useGoBack } from '../lib/navigation';

interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
}

export default function ShopMap() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goBack = useGoBack('/shops');
  const [shop, setShop] = useState<Shop | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchShop(id);
      getUserLocation();
    }
  }, [id]);

  const fetchShop = async (shopId: string) => {
    try {
      const shopData = await getShopById(shopId);

      setShop({
        id: shopData.id,
        name: shopData.name,
        address: shopData.address,
        phone: shopData.phone,
        latitude: shopData.latitude,
        longitude: shopData.longitude
      });

      // Calculate distance if we have both locations
      if (userLocation && shopData.latitude && shopData.longitude) {
        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          shopData.latitude,
          shopData.longitude
        );
        setDistance(dist);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast.error('Gagal memuat data toko');
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);

          // Calculate distance if shop data is available
          if (shop && shop.latitude && shop.longitude) {
            const dist = calculateDistance(
              userPos.lat,
              userPos.lng,
              shop.latitude,
              shop.longitude
            );
            setDistance(dist);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Silent fail - user can still see shop info without distance
          // No error message shown to avoid cluttering the UI
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 30000
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(d * 10) / 10; // Round to 1 decimal
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const openInGoogleMaps = () => {
    if (!shop || !shop.latitude || !shop.longitude) {
      toast.error('Koordinat toko tidak tersedia');
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
    window.open(url, '_blank');
  };

  if (loading || !shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 px-4 py-4 border-b border-border bg-background/95 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => goBack()}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold">Lokasi Toko</h1>
            <p className="text-xs text-muted-foreground">{shop.name}</p>
          </div>
        </div>
      </motion.header>

      {/* Map Container - Using OpenStreetMap (Free, No API Key Required) */}
      <div className="relative h-[60vh] bg-secondary">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${shop.longitude - 0.01},${shop.latitude - 0.01},${shop.longitude + 0.01},${shop.latitude + 0.01}&layer=mapnik&marker=${shop.latitude},${shop.longitude}`}
          style={{ border: 0 }}
          title="Shop Location on OpenStreetMap"
          className="w-full h-full"
        />

        {/* Map overlay with shop info */}
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-bold">{shop.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{shop.address}</p>
            </div>
            {distance !== null && (
              <div className="text-right ml-3">
                <p className="text-xl font-bold text-primary">{distance} km</p>
                <p className="text-xs text-muted-foreground">dari Anda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shop Info Card */}
      <motion.div
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{shop.name}</h2>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{shop.address}</p>
              </div>
            </div>
            {distance !== null && (
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{distance} km</p>
                <p className="text-xs text-muted-foreground">dari Anda</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a href={`tel:${shop.phone}`} className="text-sm text-primary font-medium">
              {shop.phone}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={openInGoogleMaps}
              className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              Buka di Maps
            </button>

            <button
              onClick={() => navigate(`/shops/${shop.id}`)}
              className="py-3 bg-secondary text-foreground rounded-xl font-semibold"
            >
              Lihat Toko
            </button>
          </div>
        </div>

        {/* Directions Info */}
        {userLocation && (
          <motion.div
            className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Arahkan Navigasi</p>
                <p className="text-xs text-muted-foreground">
                  Klik "Buka di Maps" untuk mendapatkan petunjuk arah ke toko menggunakan Google Maps
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}