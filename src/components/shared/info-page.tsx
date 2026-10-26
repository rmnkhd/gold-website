// Statics And Types
import { BRAND, SITE_URL } from '@/constants/brand';
import { getInfoPage, type InfoPage } from '@/statics/pages';

// Components
import JsonLd from '@/components/seo/json-ld';

// Utils And Hooks
import { breadcrumbLd } from '@/lib/seo';

/** قالب مشترک صفحه‌های اطلاعاتی/حقوقی: عنوان، تاریخ، بخش‌ها، مسیر نان‌ریزه */
export default function InfoPageView({ slug }: { slug: InfoPage['slug'] }) {
    const page = getInfoPage(slug);
    return (
        <main className="container-page max-w-3xl py-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: page.title,
                    description: page.description,
                    inLanguage: 'fa-IR',
                    url: `${SITE_URL}/${page.slug}`,
                    dateModified: page.updatedIso,
                    isPartOf: { '@type': 'WebSite', name: BRAND.name, url: SITE_URL },
                }}
            />
            <JsonLd data={breadcrumbLd([{ name: page.title, path: `/${page.slug}` }])} />
            <h1 className="text-2xl leading-[1.6] font-extrabold lg:text-3xl">{page.title}</h1>
            <p className="mt-2 text-xs text-muted-foreground">آخرین به‌روزرسانی: {page.updatedAt}</p>
            {page.sections.map((s) => (
                <section key={s.heading} className="mt-8">
                    <h2 className="mb-3 text-xl font-bold">{s.heading}</h2>
                    {s.paragraphs.map((p) => (
                        <p key={p} className="mb-3 leading-8">
                            {p}
                        </p>
                    ))}
                </section>
            ))}
        </main>
    );
}
