// Statics And Types
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/brand';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [{ userAgent: '*', allow: '/', disallow: ['/offline', '/login', '/account'] }],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
