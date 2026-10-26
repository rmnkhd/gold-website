// React
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Components
import JsonLd from '@/components/seo/json-ld';
import CityFilter from '@/components/sellers/city-filter';
import SellerCard from '@/components/sellers/seller-card';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/shared/pagination';
import { Input } from '@/components/ui/input';

// Services
import { getAllSellers, getSellers } from '@/service/api/market';

// Statics And Types
import { SITE_URL } from '@/constants/brand';

// Utils And Hooks
import { pageCount, pageHref, parsePage } from '@/lib/pagination';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';

const TITLE = 'فهرست طلافروشان و جواهرفروشان معتبر';
const DESCRIPTION =
    'طلافروشان با پروانه‌ی صنفی و فاکتور رسمی را ببینید؛ کاتالوگ، ساعت کاری و نشانی هر فروشنده در یک جا.';

interface SellersPageProps {
    searchParams: Promise<{ q?: string; city?: string; page?: string }>;
}

/** نتیجه‌ی جستجو canonical به /sellers دارد؛ صفحه‌ی ۲ به بعدِ فهرست کامل canonical خودش را */
export async function generateMetadata({ searchParams }: SellersPageProps): Promise<Metadata> {
    const { q, city, page } = await searchParams;
    const current = parsePage(page);
    const path = !q?.trim() && !city?.trim() && current > 1 ? pageHref('/sellers', current, {}) : '/sellers';
    return pageMetadata({ title: TITLE, description: DESCRIPTION, path });
}

const PAGE_SIZE = 24;

export default async function SellersPage({ searchParams }: SellersPageProps) {
    const { q, city, page: rawPage } = await searchParams;
    const page = parsePage(rawPage);
    const { data: sellers = [], total = 0 } = await getSellers({
        q: q?.trim() || undefined,
        city: city?.trim() || undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
    });
    // صفحه‌ی خارج از دامنه ۴۰۴ است تا صفحه‌ی خالیِ قابل‌ایندکس ساخته نشود
    if (page > 1 && sellers.length === 0) notFound();
    const filtered = Boolean(q?.trim() || city?.trim());
    // پیوند خزیدنیِ صفحه‌ی هر شهر (فرم جستجو با GET است و canonical ندارد)
    const cities = [...new Set((await getAllSellers()).map((s) => s.city).filter(Boolean))];

    return (
        <main className="container-page py-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    itemListElement: sellers.map((s, i) => ({
                        '@type': 'ListItem',
                        position: (page - 1) * PAGE_SIZE + i + 1,
                        url: `${SITE_URL}/sellers/${s.slug}`,
                        name: s.name,
                    })),
                }}
            />
            <JsonLd data={breadcrumbLd([{ name: 'طلافروشان معتبر', path: '/sellers' }])} />
            <h1 className="text-2xl font-extrabold lg:text-3xl">طلافروشان معتبر</h1>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
                فروشندگان دارای نشان «تأییدشده» پروانه‌ی صنفی معتبر دارند.
            </p>

            <form
                action="/sellers"
                method="get"
                className="mb-6 flex flex-wrap gap-2"
                role="search"
            >
                <Input
                    name="q"
                    defaultValue={q}
                    placeholder="نام فروشگاه یا تخصص"
                    aria-label="جستجوی فروشنده"
                    className="min-w-0 flex-1 basis-48"
                />
                <CityFilter defaultValue={city} />
                <Button type="submit" variant="gold">
                    جستجو
                </Button>
            </form>

            {cities.length ? (
                <nav className="mb-6" aria-label="شهرها">
                    <ul className="flex flex-wrap gap-2">
                        {cities.map((c) => (
                            <li key={c}>
                                <Link
                                    href={`/sellers/city/${encodeURIComponent(c)}`}
                                    className="inline-block rounded-full border bg-card px-3 py-1 text-sm hover:border-gold-300"
                                >
                                    طلافروشان {c}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            ) : null}

            <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sellers.map((s) => (
                    <SellerCard key={s.slug} seller={s} />
                ))}
            </div>
            <Pagination
                base="/sellers"
                page={page}
                pages={pageCount(total, PAGE_SIZE)}
                filters={{ q: q?.trim(), city: city?.trim() }}
            />
            {sellers.length === 0 ? (
                <p className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
                    {filtered
                        ? 'فروشنده‌ای با این مشخصات پیدا نشد.'
                        : 'هنوز فروشنده‌ای ثبت نشده است.'}
                </p>
            ) : null}
        </main>
    );
}
