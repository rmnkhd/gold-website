/**
 * تمام جاهایی که نام/اطلاعات برند نمایش داده می‌شود از این فایل می‌خوانند.
 * نام «زرینه» موقت است؛ برای تغییر فقط همین فایل عوض می‌شود.
 */
export const BRAND = {
    name: 'زرینه',
    nameLatin: 'Zarineh',
    /** شعار برند — در هیرو، ورود، فوتر و متادیتا */
    slogan: 'تلاش کن، طلاش کن',
    tagline: 'تلاش کن، طلاش کن',
    description:
        'قیمت لحظه‌ای طلا، محاسبه‌گر شفاف اجرت و مالیات، و فهرست طلافروشان معتبر؛ پیش از خرید جواهر مطمئن شوید.',
    email: 'info@example.ir',
    phone: '۰۲۱-۰۰۰۰۰۰۰۰',
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3033';
export const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL ?? 'http://localhost:3034';
