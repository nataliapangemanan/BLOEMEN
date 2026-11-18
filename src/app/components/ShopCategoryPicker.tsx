import { Check } from 'lucide-react';
import { SHOP_CATEGORIES } from '../lib/shopCategories';

interface ShopCategoryPickerProps {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

export function ShopCategoryPicker({ value, onChange, disabled }: ShopCategoryPickerProps) {
  const toggle = (id: string) => {
    if (disabled) return;
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3">
        Pilih satu atau beberapa kategori yang dijual toko Anda.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SHOP_CATEGORIES.map((cat) => {
          const active = value.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              disabled={disabled}
              className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                active
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary/30 hover:bg-secondary/50'
              }`}
            >
              {active && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
              )}
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className={`font-medium text-sm ${active ? 'text-primary' : ''}`}>
                {cat.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {cat.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
