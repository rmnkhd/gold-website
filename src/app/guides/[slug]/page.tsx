// React
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Statics And Types
import { BRAND, SITE_URL } from '@/constants/brand';
import { GUIDE_LINKS } from '@/statics/guide-links';
import { getGuide, GUIDES } from '@/statics/guides';

// Components
import GuideCta from '@/components/analytics/guide-cta';
import SellerBanner from '@/components/marketing/seller-banner';
import JsonLd from '@/components/seo/json-ld';
import PlatformNotice from '@/components/shared/platform-notice';

// Utils And Hooks
import { breadcrumbLd, OG_IMAGE, pageMetadata } from '@/lib/seo';
import { toPersianDigits } from '@/utils/number';

interface GuidePageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide) return {};
    return {
        ...pageMetadata({
            title: guide.title,
            description: guide.description,
            path: `/guides/${guide.slug}`,
            type: 'article',
        }),
        openGraph: {
            type: 'article',
            title: `${guide.title} | ${BRAND.name}`,
            description: guide.description,
            url: `/guides/${guide.slug}`,
            siteName: BRAND.name,
            locale: 'fa_IR',
            images: [OG_IMAGE],
            publishedTime: guide.publishedIso,
        },
    };
}

export default async function GuidePage({ params }: GuidePageProps) {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide) notFound();
    const meta = GUIDE_LINKS[guide.slug];
    const related = (meta?.related ?? []).map((s) => getGuide(s)).filter((g): g is NonNullable<typeof g> => Boolean(g));
    const fallback = related.length ? related : GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 2);

    return (
        <main className="container-page max-w-3xl py-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'Article',
                    headline: guide.title,
                    description: guide.description,
                    inLanguage: 'fa-IR',
                    mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
                    datePublished: guide.publishedIso,
                    dateModified: guide.publishedIso,
                    author: { '@type': 'Organization', name: BRAND.name, url: SITE_URL },
                    image: [`${SITE_URL}${OG_IMAGE.url}`],
                    publisher: { '@type': 'Organization', name: BRAND.name, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png` } },
                }}
            />
            <JsonLd
                data={breadcrumbLd([
                    { name: 'راهنمای خرید طلا', path: '/guides' },
                    { name: guide.title, path: `/guides/${guide.slug}` },
                ])}
            />
            <Link href="/guides" className="text-sm text-gold-700 hover:underline">
                ← همه‌ی راهنماها
            </Link>
            <h1 className="mt-3 text-2xl leading-[1.6] font-extrabold lg:text-3xl">
                {guide.title}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
                {guide.publishedAt} · {toPersianDigits(guide.readingMinutes)} دقیقه مطالعه
            </p>
            <p className="mt-5 leading-8 text-muted-foreground">{guide.description}</p>

            {guide.sections.map((s) => (
                <section key={s.heading} className="mt-8">
                    <h2 className="mb-3 text-xl font-bold">{s.heading}</h2>
                    {s.paragraphs.map((p) => (
                        <p key={p} className="mb-3 leading-8">
                            {p}
                        </p>
                    ))}
                </section>
            ))}

            {fallback.length ? (
                <nav className="mt-10" aria-labelledby="related-title">
                    <h2 id="related-title" className="mb-3 text-lg font-bold">
                        بیشتر بخوانید
                    </h2>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {fallback.map((g) => (
                            <li key={g.slug}>
                                <Link
                                    href={`/guides/${g.slug}`}
                                    className="hover-lift block h-full rounded-2xl border bg-card p-4"
                                >
                                    <span className="font-semibold">{g.title}</span>
                                    <span className="mt-1 block text-xs text-gold-700">
                                        {toPersianDigits(g.readingMinutes)} دقیقه مطالعه
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            ) : null}

            {meta?.links.length ? (
                <nav className="mt-10" aria-labelledby="links-title">
                    <h2 id="links-title" className="mb-3 text-lg font-bold">
                        صفحه‌های مرتبط
                    </h2>
                    <ul className="flex flex-wrap gap-2">
                        {meta.links.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="inline-block rounded-full border bg-card px-3 py-1.5 text-xs hover:border-gold-300">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            ) : null}

            <PlatformNotice className="mt-10" />

            <GuideCta />
            <SellerBanner className="mt-6" />
            <p className="mt-6 text-xs leading-6 text-muted-foreground">
                این مطلب اطلاعات عمومی است و جایگزین مشاوره‌ی حقوقی، مالی یا مالیاتی نیست.
            </p>
        </main>
    );
}
