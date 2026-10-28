// React
import type { Metadata } from 'next';

// Statics And Types
import { PRICE_INSTRUMENTS } from '@/statics/price-instruments';

// Components
import InstrumentLinks from '@/components/market/instrument-links';
import LivePrices from '@/components/market/live-prices';
import PricesSnapshot, { isVerifiedLive } from '@/components/market/prices-snapshot';
import JsonLd from '@/components/seo/json-ld';

// Services
import { getMarketPricesServer, getPriceHistoryServer } from '@/service/api/market';

// Utils And Hooks
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import { formatPrice } from '@/utils/number';

/** ISR: کش ۶۰ ثانیه‌ای هم‌خوان با `getMarketPricesServer` */
export const revalidate = 60;

const DEFAULT_DESCRIPTION = 'قیمت طلای ۱۸ و ۲۴ عیار، انواع سکه و اونس با وضعیت به‌روزرسانی داده‌ها.';

export async function generateMetadata(): Promise<Metadata> {
    const prices = await getMarketPricesServer();
    // عدد فقط وقتی در توضیح متا می‌آید که قیمت زنده و تازه باشد؛ قیمت نمونه یا کهنه هرگز
    const description = isVerifiedLive(prices)
        ? `قیمت طلای ۱۸ عیار ${formatPrice(prices.gold18)} تومان، ۲۴ عیار ${formatPrice(prices.gold24)} تومان و سکه امامی ${formatPrice(prices.coinEmami)} تومان؛ با وضعیت و زمان به‌روزرسانی.`
        : DEFAULT_DESCRIPTION;
    return pageMetadata({ title: 'قیمت طلا و سکه', description, path: '/prices' });
}

export default async function PricesPage() {
    const [prices, histories] = await Promise.all([
        getMarketPricesServer(),
        Promise.all(PRICE_INSTRUMENTS.map((i) => getPriceHistoryServer(i.key, '7d'))),
    ]);
    const cards = PRICE_INSTRUMENTS.map((instrument, n) => ({ instrument, summary: histories[n]?.summary }));
    return (
        <main className="container-page py-8">
            <JsonLd data={breadcrumbLd([{ name: 'قیمت طلا و سکه', path: '/prices' }])} />
            <h1 className="text-2xl font-extrabold lg:text-3xl">قیمت طلا و سکه</h1>
            <p className="mt-2 mb-6 max-w-2xl text-sm leading-7 text-muted-foreground">
                وضعیت و زمان به‌روزرسانی هر قیمت را بررسی کنید. دادهٔ نمونه یا کهنه، مبنای معامله نیست؛ قیمت نهایی را با فروشنده هماهنگ کنید.
            </p>
            <LivePrices />
            <PricesSnapshot prices={prices} />
            <InstrumentLinks cards={cards} />
        </main>
    );
}
