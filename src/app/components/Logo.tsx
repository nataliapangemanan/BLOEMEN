import logoUrl from '../../imports/logo.jpeg';

interface LogoProps {
  /** Ukuran sisi (px) untuk varian ikon persegi. Default 40. */
  size?: number;
  /** Class tambahan untuk wrapper. */
  className?: string;
  /** Sudut membulat. Default true. */
  rounded?: boolean;
}

/**
 * Logo aplikasi Bloemen.
 * Gambar sumber ada di `src/imports/logo.jpeg` (mark tulip + wordmark BLOEMEN
 * di atas latar krem). Ditampilkan sebagai ikon persegi.
 */
export default function Logo({ size = 40, className = '', rounded = true }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Bloemen"
      width={size}
      height={size}
      className={`object-cover ${rounded ? 'rounded-xl' : ''} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export { logoUrl };
