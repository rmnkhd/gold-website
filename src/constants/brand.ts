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

/**
 * نشانی عمومی سایت برای canonical، og:url و sitemap. در production بدون مقدار صریح، build شکست می‌خورد؛
 * وگرنه همه‌ی نشانی‌ها بی‌صدا به localhost اشاره می‌کردند.
 */
const resolveSiteUrl = (): string => {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    if (url) return url.replace(/\/$/, '');
    if (process.env.NODE_ENV === 'production') {
        throw new Error('NEXT_PUBLIC_SITE_URL باید برای build تولید تنظیم شود (مثلاً https://example.ir)');
    }
    return 'http://localhost:3033';
};

export const SITE_URL = resolveSiteUrl();
export const PANEL_URL = process.env.NEXT_PUBLIC_PANEL_URL ?? 'http://localhost:3034';
