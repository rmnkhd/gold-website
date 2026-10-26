// Statics And Types
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/constants/brand';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // صفحه‌های شخصی/فنی؛ برای نتیجه‌ی جستجوی داخلی فروشندگان canonical به /sellers اشاره می‌کند
                disallow: ['/offline', '/login', '/account', '/verify/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
