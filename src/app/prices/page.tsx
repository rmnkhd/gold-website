import type { Metadata } from 'next';
import LivePrices from '@/components/market/live-prices';

export const metadata: Metadata = {
    title: 'قیمت طلا و سکه',
    description: 'قیمت طلای ۱۸ و ۲۴ عیار، انواع سکه و اونس با وضعیت به‌روزرسانی داده‌ها.',
    alternates: { canonical: '/prices' },
};

export default function PricesPage() {
    return (
        <main className="container-page py-8">
            <h1 className="text-2xl font-extrabold lg:text-3xl">قیمت طلا و سکه</h1>
            <p className="mt-2 mb-6 max-w-2xl text-sm leading-7 text-muted-foreground">
                وضعیت و زمان به‌روزرسانی هر قیمت را بررسی کنید. دادهٔ نمونه یا کهنه، مبنای معامله نیست؛ قیمت نهایی را با فروشنده هماهنگ کنید.
            </p>
            <LivePrices />
        </main>
    );
}
