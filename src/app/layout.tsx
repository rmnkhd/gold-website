// React
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

// Statics And Types
import { BRAND, SITE_URL } from '@/constants/brand';

// Components
import Provider from './provider';
import BottomNav from '@/components/layout/bottom-nav';
import SiteFooter from '@/components/layout/site-footer';
import SiteHeader from '@/components/layout/site-header';
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
    openGraph: {
        type: 'website',
        locale: 'fa_IR',
        siteName: BRAND.name,
    },
    alternates: { canonical: '/' },
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
                        '@type': 'WebSite',
                        name: BRAND.name,
                        url: SITE_URL,
                        inLanguage: 'fa-IR',
                        description: BRAND.description,
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
            </body>
        </html>
    );
}
