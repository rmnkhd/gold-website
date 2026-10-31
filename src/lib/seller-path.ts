/**
 * اگر فروشگاه slug خود را عوض کرده باشد، API با slug قدیمی همان فروشنده را با slug فعلی برمی‌گرداند؛
 * صفحه باید ۳۰۸ بدهد تا نشانی قدیمی و اعتبار سئوی آن به نشانی تازه منتقل شود.
 */
export function sellerRedirectPath(requested: string, current: string): string | null {
    let decoded = requested;
    try {
        decoded = decodeURIComponent(requested);
    } catch {
        // نشانی خراب: همان خام مقایسه می‌شود
    }
    return decoded === current ? null : `/sellers/${current}`;
}
