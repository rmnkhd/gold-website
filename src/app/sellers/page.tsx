// React
import type { Metadata } from 'next';

// Components
import JsonLd from '@/components/seo/json-ld';
import CityFilter from '@/components/sellers/city-filter';
import SellerCard from '@/components/sellers/seller-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Services
import { getSellers } from '@/service/api/market';

// Statics And Types
import { SITE_URL } from '@/constants/brand';

export const metadata: Metadata = {
    title: 'فهرست طلافروشان و جواهرفروشان معتبر',
    description:
        'طلافروشان با پروانه‌ی صنفی و فاکتور رسمی را ببینید؛ کاتالوگ، ساعت کاری و نشانی هر فروشنده در یک جا.',
    alternates: { canonical: '/sellers' },
};

interface SellersPageProps {
    searchParams: Promise<{ q?: string; city?: string }>;
}

export default async function SellersPage({ searchParams }: SellersPageProps) {
    const { q, city } = await searchParams;
    const sellers =
        (await getSellers({ q: q?.trim() || undefined, city: city?.trim() || undefined })).data ??
        [];
    const filtered = Boolean(q?.trim() || city?.trim());

    return (
        <main className="container-page py-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    itemListElement: sellers.map((s, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        url: `${SITE_URL}/sellers/${s.slug}`,
                        name: s.name,
                    })),
                }}
            />
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

            <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sellers.map((s) => (
                    <SellerCard key={s.slug} seller={s} />
                ))}
            </div>
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
