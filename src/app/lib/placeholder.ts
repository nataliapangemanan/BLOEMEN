/**
 * Placeholder gambar lokal (SVG data-URI) untuk gambar produk/toko yang
 * belum tersedia. Tidak membutuhkan koneksi jaringan sehingga
 * selalu tampil, baik saat produk belum punya foto maupun sebagai fallback.
 */

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fde4ef"/>
      <stop offset="1" stop-color="#f7c8dd"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <g transform="translate(400 360)" fill="#e56aa0" opacity="0.9">
    <circle cx="0" cy="-70" r="46"/>
    <circle cx="66" cy="-22" r="46"/>
    <circle cx="41" cy="60" r="46"/>
    <circle cx="-41" cy="60" r="46"/>
    <circle cx="-66" cy="-22" r="46"/>
    <circle cx="0" cy="0" r="34" fill="#fff3c4"/>
  </g>
  <path d="M400 400 L360 620 M400 400 L440 620" stroke="#4b9d6e" stroke-width="14" stroke-linecap="round" fill="none"/>
  <text x="400" y="720" font-family="sans-serif" font-size="34" fill="#b34a7d" text-anchor="middle" opacity="0.7">Bloemen</text>
</svg>`.trim();

export const FLOWER_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
