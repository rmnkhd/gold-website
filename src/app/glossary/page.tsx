// React
import type { Metadata } from 'next';
import Link from 'next/link';

// Statics And Types
import { SITE_URL } from '@/constants/brand';
import { GLOSSARY } from '@/statics/glossary';
import { GUIDES } from '@/statics/guides';

// Components
import JsonLd from '@/components/seo/json-ld';

// Utils And Hooks
import { breadcrumbLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'واژه‌نامه‌ی طلا و جواهر',
    description:
        'معنی اجرت، سود، عیار، مثقال، سوت، حباب سکه، مظنه، آب‌شده و ده‌ها واژه‌ی دیگر بازار طلا به زبان ساده؛ برای خواندن درست فاکتور و قیمت.',
    path: '/glossary',
});

export default function GlossaryPage() {
    const guideTitle = new Map(GUIDES.map((g) => [g.slug, g.title]));
    return (
        <main className="container-page max-w-3xl py-8">
            <JsonLd data={breadcrumbLd([{ name: 'واژه‌نامه‌ی طلا و جواهر', path: '/glossary' }])} />
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'DefinedTermSet',
                    name: 'واژه‌نامه‌ی طلا و جواهر',
                    url: `${SITE_URL}/glossary`,
                    inLanguage: 'fa',
                    hasDefinedTerm: GLOSSARY.map((t) => ({
                        '@type': 'DefinedTerm',
                        name: t.term,
                        description: t.definition,
                        url: `${SITE_URL}/glossary#${t.id}`,
                        inDefinedTermSet: `${SITE_URL}/glossary`,
                    })),
                }}
            />
            <h1 className="text-2xl font-extrabold lg:text-3xl">واژه‌نامه‌ی طلا و جواهر</h1>
            <p className="mt-2 mb-6 text-sm leading-7 text-muted-foreground">
                معنی واژه‌هایی که روی فاکتور و در گفت‌وگو با طلافروش می‌شنوید. اطلاعات عمومی است؛ نرخ‌ها و قوانین را از منبع رسمی بگیرید.
            </p>
            <nav aria-label="فهرست واژه‌ها" className="mb-8 flex flex-wrap gap-1.5">
                {GLOSSARY.map((t) => (
                    <a key={t.id} href={`#${t.id}`} className="rounded-full border px-3 py-1 text-xs hover:border-gold-300">
                        {t.term}
                    </a>
                ))}
            </nav>
            <dl className="divide-y rounded-2xl border bg-card">
                {GLOSSARY.map((t) => (
                    <div key={t.id} id={t.id} className="scroll-mt-20 p-5">
                        <dt className="font-semibold">{t.term}</dt>
                        {t.aliases?.length ? <dd className="mt-0.5 text-[11px] text-muted-foreground">{t.aliases.join(' · ')}</dd> : null}
                        <dd className="mt-1.5 text-sm leading-8">{t.definition}</dd>
                        {t.guide && guideTitle.has(t.guide) ? (
                            <dd className="mt-2">
                                <Link href={`/guides/${t.guide}`} className="text-xs text-gold-700 hover:underline">
                                    بیشتر بخوانید: {guideTitle.get(t.guide)}
                                </Link>
                            </dd>
                        ) : null}
                    </div>
                ))}
            </dl>
            <p className="mt-6 text-sm">
                <Link href="/calculator" className="text-gold-700 hover:underline">
                    قیمت یک جواهر را با محاسبه‌گر بسنجید
                </Link>
            </p>
        </main>
    );
}
