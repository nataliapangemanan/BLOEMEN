import { Tag } from 'lucide-react';

interface DiscountBadgeProps {
  originalPrice: number;
  discountPercentage: number;
  discountPrice: number;
  size?: 'sm' | 'md' | 'lg';
}

export function DiscountBadge({
  originalPrice,
  discountPercentage,
  discountPrice,
  size = 'md'
}: DiscountBadgeProps) {
  const savings = originalPrice - discountPrice;

  const sizes = {
    sm: { text: 'text-xs', badge: 'px-2 py-0.5', icon: 'w-3 h-3' },
    md: { text: 'text-sm', badge: 'px-2 py-1', icon: 'w-4 h-4' },
    lg: { text: 'text-base', badge: 'px-3 py-1', icon: 'w-5 h-5' }
  };

  const s = sizes[size];

  return (
    <div className="space-y-1">
      {/* Discount Badge */}
      <div className={`inline-flex items-center gap-1 bg-red-500 text-white ${s.badge} rounded-full font-bold ${s.text}`}>
        <Tag className={s.icon} />
        {discountPercentage}% OFF
      </div>

      {/* Price Display */}
      <div className="flex items-center gap-2">
        <span className={`font-bold text-red-600 dark:text-red-400 ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'}`}>
          Rp {discountPrice.toLocaleString('id-ID')}
        </span>
        <span className={`line-through text-muted-foreground ${s.text}`}>
          Rp {originalPrice.toLocaleString('id-ID')}
        </span>
      </div>

      {/* Savings */}
      <p className={`text-green-600 dark:text-green-400 font-semibold ${s.text}`}>
        Hemat Rp {savings.toLocaleString('id-ID')}
      </p>
    </div>
  );
}
