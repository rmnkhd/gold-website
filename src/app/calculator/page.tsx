// React
import type { Metadata } from 'next';

// Components
import PriceCalculator from '@/components/market/price-calculator';
import JsonLd from '@/components/seo/json-ld';

export const metadata: Metadata = {
    title: 'محاسبه‌گر قیمت طلا و جواهر (اجرت، سود و مالیات)',
    description:
        'قیمت جواهر را بر اساس وزن، عیار، اجرت و سود فروشنده حساب کنید و ببینید مالیات دقیقاً روی چه بخشی اعمال می‌شود.',
    alternates: { canonical: '/calculator' },
};

export default function CalculatorPage() {
    return (
        <main className="container-page py-8">
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'WebApplication',
                    name: 'محاسبه‌گر قیمت طلا و جواهر',
                    applicationCategory: 'FinanceApplication',
                    inLanguage: 'fa-IR',
                    operatingSystem: 'Web',
                }}
            />
            <h1 className="text-2xl font-extrabold lg:text-3xl">محاسبه‌گر قیمت جواهر</h1>
            <p className="mt-2 mb-6 max-w-2xl text-sm leading-7 text-muted-foreground">
                قیمت نهایی از چهار جزء ساخته می‌شود: ارزش طلا، اجرت ساخت، سود فروشنده و مالیات
                (فقط روی اجرت و سود). با وارد کردن درصدهایی که فروشنده می‌گوید، قیمت را بسنجید.
            </p>
            <PriceCalculator />
        </main>
    );
}
