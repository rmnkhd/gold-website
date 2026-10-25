// Statics And Types
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/brand';
import { GUIDES } from '@/statics/guides';

// Services
import { getSellers } from '@/service/api/market';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sellers = (await getSellers()).data ?? [];
    const fixed = ['', '/calculator', '/prices', '/sellers', '/compare', '/guides'];

    return [
        ...fixed.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: 'daily' as const })),
        ...sellers.map((s) => ({
            url: `${SITE_URL}/sellers/${s.slug}`,
            changeFrequency: 'weekly' as const,
        })),
        ...GUIDES.map((g) => ({
            url: `${SITE_URL}/guides/${g.slug}`,
            changeFrequency: 'monthly' as const,
        })),
    ];
}
