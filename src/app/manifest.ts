// Statics And Types
import type { MetadataRoute } from 'next';
import { BRAND } from '@/constants/brand';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${BRAND.name} — ${BRAND.tagline}`,
        short_name: BRAND.name,
        description: BRAND.description,
        start_url: '/',
        display: 'standalone',
        dir: 'rtl',
        lang: 'fa',
        background_color: '#f8f9fc',
        theme_color: '#0f2147',
        icons: [
            { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    };
}
