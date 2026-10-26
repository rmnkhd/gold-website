// Statics And Types
import type { Metadata } from 'next';
import { BRAND, SITE_URL } from '../constants/brand.ts';

/** تصویر پیش‌فرض اشتراک‌گذاری (۱۲۰۰×۶۳۰)؛ Next تصویر لایه‌ی ریشه را به صفحه‌هایی که openGraph خودشان را دارند نمی‌رساند */
export const OG_IMAGE = {
    url: '/og-default.png',
    width: 1200,
    height: 630,
    alt: `${BRAND.name} — ${BRAND.description}`,
};

interface PageMetaInput {
    title: string;
    description: string;
    /** مسیر canonical (مثلاً `/sellers`)؛ همیشه بدون پارامتر جستجو */
    path: string;
    type?: 'website' | 'article';
    /** عنوان کامل بدون پسوند نام برند (صفحه‌ی اصلی) */
    absoluteTitle?: boolean;
}

/**
 * متادیتای کامل یک صفحه‌ی عمومی: عنوان، توضیح، canonical اختصاصی، Open Graph (با `url`) و کارت توییتر.
 * canonical در لایه‌ی ریشه تعریف نمی‌شود تا هیچ صفحه‌ای ناخواسته به صفحه‌ی اصلی اشاره نکند.
 */
export function pageMetadata({
    title,
    description,
    path,
    type = 'website',
    absoluteTitle = false,
}: PageMetaInput): Metadata {
    const fullTitle = absoluteTitle ? title : `${title} | ${BRAND.name}`;
    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: { canonical: path },
        openGraph: {
            type,
            title: fullTitle,
            description,
            url: path,
            siteName: BRAND.name,
            locale: 'fa_IR',
            images: [OG_IMAGE],
        },
        twitter: { card: 'summary_large_image', title: fullTitle, description, images: [OG_IMAGE.url] },
    };
}

export interface Crumb {
    name: string;
    path: string;
}

/** داده‌ی ساخت‌یافته‌ی مسیر صفحه (BreadcrumbList) — اولین مورد همیشه «خانه» است */
export function breadcrumbLd(crumbs: Crumb[]): Record<string, unknown> {
    const all: Crumb[] = [{ name: BRAND.name, path: '/' }, ...crumbs];
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: `${SITE_URL}${c.path === '/' ? '' : c.path}`,
        })),
    };
}
