import { Clock, Calendar, Flower2, Info } from 'lucide-react';

interface FlowerInfoCardProps {
  flowerType: 'live' | 'artificial' | 'mixed';
  poDurationDays?: number;
  flowerLifetimeDays?: number;
  careInstructions?: string;
}

export function FlowerInfoCard({
  flowerType,
  poDurationDays,
  flowerLifetimeDays,
  careInstructions
}: FlowerInfoCardProps) {
  const getFlowerTypeInfo = () => {
    switch (flowerType) {
      case 'live':
        return {
          label: 'Bunga Hidup',
          color: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400',
          icon: <Flower2 className="w-4 h-4" />
        };
      case 'artificial':
        return {
          label: 'Bunga Artifisial',
          color: 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400',
          icon: <Flower2 className="w-4 h-4" />
        };
      case 'mixed':
        return {
          label: 'Bunga Campuran',
          color: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400',
          icon: <Flower2 className="w-4 h-4" />
        };
    }
  };

  const typeInfo = getFlowerTypeInfo();

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-border rounded-xl">
      {/* Flower Type */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-semibold text-sm ${typeInfo.color}`}>
        {typeInfo.icon}
        {typeInfo.label}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* PO Duration */}
        {poDurationDays && poDurationDays > 0 && (
          <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Durasi Pre-Order</p>
              <p className="font-bold">{poDurationDays} hari</p>
            </div>
          </div>
        )}

        {/* Flower Lifetime */}
        {flowerType === 'live' && flowerLifetimeDays && flowerLifetimeDays > 0 && (
          <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Daya Tahan</p>
              <p className="font-bold">{flowerLifetimeDays} hari</p>
            </div>
          </div>
        )}
      </div>

      {/* Care Instructions */}
      {flowerType === 'live' && careInstructions && (
        <div className="p-3 bg-background/50 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-primary">Cara Perawatan:</p>
          </div>
          <p className="text-sm text-muted-foreground pl-6">
            {careInstructions}
          </p>
        </div>
      )}

      {/* Lifetime Warning for Live Flowers */}
      {flowerType === 'live' && flowerLifetimeDays && flowerLifetimeDays > 0 && (
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            <strong>Perhatian:</strong> Bunga hidup akan bertahan {flowerLifetimeDays} hari dengan perawatan yang tepat. Pastikan mengikuti instruksi perawatan.
          </p>
        </div>
      )}
    </div>
  );
}
