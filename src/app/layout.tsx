// React
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

// Statics And Types
import { BRAND, SITE_URL } from '@/constants/brand';
import { OG_IMAGE } from '@/lib/seo';

// Components
import Provider from './provider';
import BottomNav from '@/components/layout/bottom-nav';
import SiteFooter from '@/components/layout/site-footer';
import SiteHeader from '@/components/layout/site-header';
import Tracker from '@/components/analytics/tracker';
import SwRegister from '@/components/pwa/sw-register';
import JsonLd from '@/components/seo/json-ld';
import { Toaster } from '@/components/ui/sonner';

// Assets
import './globals.css';

/** IRANSansX متغیر است، پس یک فایل هم برای متن و هم برای تیترها کافی است. */
const iranSans = localFont({
    src: '../assets/fonts/iransans/IRANSansXV.woff2',
    variable: '--font-body',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${BRAND.name} — ${BRAND.tagline}`,
        template: `%s | ${BRAND.name}`,
    },
    description: BRAND.description,
    manifest: '/manifest.webmanifest',
    icons: { icon: '/icon.svg', apple: '/apple-touch-icon.png' },
    applicationName: BRAND.name,
    // canonical در هر صفحه جدا تعریف می‌شود؛ مقدار ریشه همه‌ی صفحه‌ها را به خانه نسبت می‌داد
    openGraph: {
        type: 'website',
        locale: 'fa_IR',
        siteName: BRAND.name,
        images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', images: [OG_IMAGE.url] },
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
};

export const viewport: Viewport = {
    themeColor: '#0f2147',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="fa" dir="rtl" suppressHydrationWarning>
            <body className={`${iranSans.variable} font-sans`}>
                <JsonLd
                    data={{
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'Organization',
                                '@id': `${SITE_URL}/#organization`,
                                name: BRAND.name,
                                alternateName: BRAND.nameLatin,
                                url: SITE_URL,
                                logo: `${SITE_URL}/icon-512.png`,
                            },
                            {
                                '@type': 'WebSite',
                                '@id': `${SITE_URL}/#website`,
                                name: BRAND.name,
                                url: SITE_URL,
                                inLanguage: 'fa-IR',
                                description: BRAND.description,
                                publisher: { '@id': `${SITE_URL}/#organization` },
                                potentialAction: {
                                    '@type': 'SearchAction',
                                    target: {
                                        '@type': 'EntryPoint',
                                        urlTemplate: `${SITE_URL}/sellers?q={search_term_string}`,
                                    },
                                    'query-input': 'required name=search_term_string',
                                },
                            },
                        ],
                    }}
                />
                <Provider>
                    <SiteHeader />
                    <div className="min-h-[70dvh] pb-24 lg:pb-0">{children}</div>
                    <SiteFooter />
                    <BottomNav />
                </Provider>
                <Toaster position="top-center" closeButton />
                <SwRegister />
                <Tracker />
            </body>
        </html>
    );
}
