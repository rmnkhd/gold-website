// React
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Statics And Types
import { BRAND, SITE_URL } from '@/constants/brand';
import { getGuide, GUIDES } from '@/statics/guides';

// Components
import JsonLd from '@/components/seo/json-ld';
import PlatformNotice from '@/components/shared/platform-notice';
import { Button } from '@/components/ui/button';

// Utils And Hooks
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
        title: guide.title,
        description: guide.description,
        alternates: { canonical: `/guides/${guide.slug}` },
        openGraph: { type: 'article', title: guide.title, description: guide.description },
    };
}

export default async function GuidePage({ params }: GuidePageProps) {
    const { slug } = await params;
    const guide = getGuide(slug);
    if (!guide) notFound();

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
                    publisher: { '@type': 'Organization', name: BRAND.name },
                }}
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

            <PlatformNotice className="mt-10" />

            <div className="mt-6 rounded-2xl bg-brand-50 p-5">
                <p className="font-semibold">قیمت را خودتان بسنجید</p>
                <Button asChild variant="gold" className="mt-3">
                    <Link href="/calculator">رفتن به محاسبه‌گر</Link>
                </Button>
            </div>
            <p className="mt-6 text-xs leading-6 text-muted-foreground">
                این مطلب اطلاعات عمومی است و جایگزین مشاوره‌ی حقوقی، مالی یا مالیاتی نیست.
            </p>
        </main>
    );
}
