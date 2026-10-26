// Statics And Types
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/brand';
import { GUIDES } from '@/statics/guides';
import { INFO_PAGES } from '@/statics/pages';

// Services
import { getAllSellers } from '@/service/api/market';

/** هر ساعت دوباره ساخته می‌شود تا فروشنده‌ی تازه زود دیده شود؛ تاریخ هر ورودی = آخرین تغییر واقعی همان فروشنده */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const FIXED: { path: string; changeFrequency: Entry['changeFrequency']; priority: number }[] = [
    { path: '', changeFrequency: 'daily', priority: 1 },
    { path: '/prices', changeFrequency: 'hourly', priority: 0.9 },
    { path: '/calculator', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/sellers', changeFrequency: 'daily', priority: 0.8 },
    { path: '/compare', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/guides', changeFrequency: 'weekly', priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // بک‌اند در دسترس نباشد `getSellers` فهرست خالی می‌دهد و sitemap باز هم ساخته می‌شود
    const sellers = await getAllSellers();
    const cities = [...new Set(sellers.map((s) => s.city).filter(Boolean))];

    return [
        // صفحه‌های ثابت lastmod ندارند: تاریخ «همیشه الان» را موتور جستجو نادیده می‌گیرد و به کل sitemap بی‌اعتماد می‌شود
        ...FIXED.map((f) => ({
            url: `${SITE_URL}${f.path}`,
            changeFrequency: f.changeFrequency,
            priority: f.priority,
        })),
        ...sellers.map((s) => ({
            url: `${SITE_URL}/sellers/${s.slug}`,
            lastModified: new Date(s.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        })),
        ...cities.map((c) => ({
            url: `${SITE_URL}/sellers/city/${encodeURIComponent(c)}`,
            lastModified: new Date(
                Math.max(...sellers.filter((s) => s.city === c).map((s) => new Date(s.updatedAt).getTime()))
            ),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        })),
        ...INFO_PAGES.map((p) => ({
            url: `${SITE_URL}/${p.slug}`,
            lastModified: new Date(p.updatedIso),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        })),
        ...GUIDES.map((g) => ({
            url: `${SITE_URL}/guides/${g.slug}`,
            lastModified: new Date(g.publishedIso),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })),
    ];
}
