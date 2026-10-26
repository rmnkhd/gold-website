// React
import type { Metadata } from 'next';

// Components
import PriceCalculator from '@/components/market/price-calculator';
import JsonLd from '@/components/seo/json-ld';

// Utils And Hooks
import { breadcrumbLd, pageMetadata } from '@/lib/seo';

// Statics And Types
import { SITE_URL } from '@/constants/brand';

export const metadata: Metadata = pageMetadata({
    title: 'محاسبه‌گر قیمت طلا و جواهر (اجرت، سود و مالیات)',
    description:
        'قیمت جواهر را بر اساس وزن، عیار، اجرت و سود فروشنده حساب کنید و ببینید مالیات دقیقاً روی چه بخشی اعمال می‌شود.',
    path: '/calculator',
});

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
                    url: `${SITE_URL}/calculator`,
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'IRR' },
                }}
            />
            <JsonLd data={breadcrumbLd([{ name: 'محاسبه‌گر قیمت جواهر', path: '/calculator' }])} />
            <h1 className="text-2xl font-extrabold lg:text-3xl">محاسبه‌گر قیمت جواهر</h1>
            <p className="mt-2 mb-6 max-w-2xl text-sm leading-7 text-muted-foreground">
                قیمت نهایی از چهار جزء ساخته می‌شود: ارزش طلا، اجرت ساخت، سود فروشنده و مالیات
                (فقط روی اجرت و سود). با وارد کردن درصدهایی که فروشنده می‌گوید، قیمت را بسنجید.
            </p>
            <PriceCalculator />
        </main>
    );
}
