/**
 * منبع کاشی‌های نقشه. پیش‌فرض OpenStreetMap (رایگان، بدون کلید)؛ برای سرور کاشی داخلی/نشان/بلد
 * فقط `NEXT_PUBLIC_MAP_TILE_URL` را عوض کنید → decisions/نقشه و کاشی‌ها.md
 */
export const MAP_TILE_URL = process.env.NEXT_PUBLIC_MAP_TILE_URL ?? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_ATTRIBUTION =
    process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ?? '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** بزرگ‌نمایی: کل کشور، شهر، نشانگر */
export const MAP_ZOOM = { country: 5, city: 12, pin: 16 } as const;
