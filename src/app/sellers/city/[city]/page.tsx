// React
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Statics And Types
import { SITE_URL } from '@/constants/brand';

// Components
import JsonLd from '@/components/seo/json-ld';
import SellerCard from '@/components/sellers/seller-card';
import Pagination from '@/components/shared/pagination';

// Services
import { getAllSellers, getSellers } from '@/service/api/market';

// Utils And Hooks
import { pageCount, pageHref, parsePage } from '@/lib/pagination';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import { toPersianDigits } from '@/utils/number';

interface CityPageProps {
    params: Promise<{ city: string }>;
    searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 24;

/** ISR: هر ۶۰ ثانیه تازه می‌شود؛ شهر بدون فروشنده ۴۰۴ است (صفحه‌ی خالی ایندکس نشود) */
export const revalidate = 60;

const cityName = (raw: string): string => decodeURIComponent(raw);

export async function generateStaticParams() {
    const sellers = await getAllSellers();
    return [...new Set(sellers.map((s) => s.city).filter(Boolean))].map((city) => ({ city: encodeURIComponent(city) }));
}

export async function generateMetadata({ params, searchParams }: CityPageProps): Promise<Metadata> {
    const city = cityName((await params).city);
    const current = parsePage((await searchParams).page);
    const { total } = await getSellers({ city, limit: 1 });
    if (!total) return {};
    return pageMetadata({
        title: `طلافروشان معتبر ${city}`,
        description: `${toPersianDigits(total)} طلافروش و جواهرفروش در ${city}؛ نشانی، ساعت کاری، کاتالوگ و قیمت تخمینی با اجرت و مالیات شفاف.`,
        path: pageHref(`/sellers/city/${encodeURIComponent(city)}`, current, {}),
    });
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
    const city = cityName((await params).city);
    const page = parsePage((await searchParams).page);
    const [{ data: sellers = [], total = 0 }, all] = await Promise.all([
        getSellers({ city, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
        getAllSellers(),
    ]);
    if (sellers.length === 0) notFound();
    const otherCities = [...new Set(all.map((s) => s.city).filter((c) => c && c !== city))];

    return (
        <main className="container-page py-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: `طلافروشان معتبر ${city}`,
                    itemListElement: sellers.map((s, i) => ({
                        '@type': 'ListItem',
                        position: (page - 1) * PAGE_SIZE + i + 1,
                        url: `${SITE_URL}/sellers/${s.slug}`,
                        name: s.name,
                    })),
                }}
            />
            <JsonLd
                data={breadcrumbLd([
                    { name: 'طلافروشان معتبر', path: '/sellers' },
                    { name: city, path: `/sellers/city/${encodeURIComponent(city)}` },
                ])}
            />
            <h1 className="text-2xl font-extrabold lg:text-3xl">طلافروشان معتبر {city}</h1>
            <p className="mt-2 mb-6 max-w-2xl text-sm leading-7 text-muted-foreground">
                {toPersianDigits(total)} فروشنده در {city} ثبت شده‌اند. فروشندگان دارای نشان «تأییدشده» پروانه‌ی صنفی معتبر
                دارند؛ قبل از خرید، قیمت را با{' '}
                <Link href="/calculator" className="text-gold-700 underline-offset-4 hover:underline">
                    محاسبه‌گر شفاف
                </Link>{' '}
                بسنجید.
            </p>
            <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sellers.map((s) => (
                    <SellerCard key={s.slug} seller={s} />
                ))}
            </div>
            <Pagination
                base={`/sellers/city/${encodeURIComponent(city)}`}
                page={page}
                pages={pageCount(total, PAGE_SIZE)}
            />
            {otherCities.length ? (
                <nav className="mt-10" aria-label="شهرهای دیگر">
                    <h2 className="mb-3 text-base font-bold">طلافروشان شهرهای دیگر</h2>
                    <ul className="flex flex-wrap gap-2">
                        {otherCities.map((c) => (
                            <li key={c}>
                                <Link
                                    href={`/sellers/city/${encodeURIComponent(c)}`}
                                    className="inline-block rounded-full border bg-card px-3 py-1 text-sm hover:border-gold-300"
                                >
                                    {c}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            ) : null}
        </main>
    );
}
