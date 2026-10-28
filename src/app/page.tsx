// React
import type { Metadata } from 'next';
import Link from 'next/link';

// Statics And Types
import { BRAND } from '@/constants/brand';
import { GUIDES } from '@/statics/guides';
import { PLATFORM_FAQ } from '@/statics/platform-notice';

// Components
import { Icon, type IconName } from '@/components/icon';
import LivePrices from '@/components/market/live-prices';
import SellerBanner from '@/components/marketing/seller-banner';
import PriceTicker from '@/components/market/price-ticker';
import Reveal from '@/components/motion/reveal';
import Slogan from '@/components/motion/slogan';
import PlatformNotice from '@/components/shared/platform-notice';
import JsonLd from '@/components/seo/json-ld';
import SellerCard from '@/components/sellers/seller-card';
import { Button } from '@/components/ui/button';

// Utils And Hooks
import { pageMetadata } from '@/lib/seo';

// Services
import { getSellers } from '@/service/api/market';

export const metadata: Metadata = pageMetadata({
    title: `${BRAND.name} — قیمت لحظه‌ای طلا و فروشندگان معتبر`,
    description: BRAND.description,
    path: '/',
    absoluteTitle: true,
});

const FEATURES: { href: string; icon: IconName; title: string; text: string }[] = [
    {
        icon: 'calculator', href: '/calculator',
        title: 'محاسبه‌گر شفاف',
        text: 'طلا، اجرت، سود و مالیات را جدا ببینید و قیمت منصفانه را بسنجید.',
    },
    {
        icon: 'shield-check', href: '/sellers',
        title: 'فروشنده‌ی تأییدشده',
        text: 'فروشندگانی با پروانه‌ی صنفی و فاکتور رسمی را پیدا کنید.',
    },
    {
        icon: 'clock', href: '/prices',
        title: 'قیمت لحظه‌ای',
        text: 'قیمت روز هر گرم و سکه، همیشه در دسترس؛ حتی با نصب روی گوشی.',
    },
];

const FAQ = [
    PLATFORM_FAQ,
    {
        q: 'قیمت نهایی جواهر از چه چیزهایی ساخته می‌شود؟',
        a: 'ارزش طلا (وزن × قیمت روز)، اجرت ساخت، سود فروشنده و مالیات که روی اجرت و سود محاسبه می‌شود.',
    },
    {
        q: 'چطور مطمئن شوم فروشنده معتبر است؟',
        a: 'نشان «تأییدشده» یعنی پروانه‌ی صنفی بررسی شده است. همیشه فاکتور رسمی با تفکیک وزن، عیار و اجرت بگیرید.',
    },
    {
        q: 'آیا برنامه را می‌شود روی گوشی نصب کرد؟',
        a: 'بله؛ این سایت یک PWA است و از منوی مرورگر می‌توانید آن را به صفحه‌ی اصلی گوشی اضافه کنید.',
    },
];

export default async function HomePage() {
    const sellers = (await getSellers()).data ?? [];

    return (
        <main>
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: FAQ.map((f) => ({
                        '@type': 'Question',
                        name: f.q,
                        acceptedAnswer: { '@type': 'Answer', text: f.a },
                    })),
                }}
            />

            <section className="container-page grid gap-8 py-8 lg:grid-cols-2 lg:items-center lg:py-14">
                <div>
                    <p className="animate-rise mb-3 inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-800">
                        <Icon name="sparkles" className="size-3.5" />
                        شفافیت در خرید طلا
                    </p>
                    <h1 className="text-3xl leading-[1.5] font-extrabold text-brand-900 lg:text-5xl lg:leading-[1.4]">
                        <span className="animate-rise delay-a1 inline-block">
                            پیش از خرید جواهر،
                        </span>
                        <br />
                        <span className="animate-rise delay-a2 inline-block">
                            <span className="text-gold-600">قیمت منصفانه</span> را بدانید
                        </span>
                    </h1>
                    <p className="animate-rise delay-a3 mt-5 text-2xl font-extrabold lg:text-3xl">
                        <Slogan />
                    </p>
                    <p className="animate-rise delay-a4 mt-6 max-w-md leading-8 text-muted-foreground">
                        {BRAND.description}
                    </p>
                    <div className="animate-rise delay-a5 mt-6 flex flex-wrap gap-3">
                        <Button asChild variant="gold" size="lg">
                            <Link href="/calculator">
                                <Icon name="calculator" />
                                محاسبه‌ی قیمت
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/sellers">فروشندگان معتبر</Link>
                        </Button>
                    </div>
                </div>
                <LivePrices />
            </section>

            <PriceTicker />

            <section className="container-page py-8" aria-labelledby="features-title">
                <h2 id="features-title" className="sr-only">
                    چرا {BRAND.name}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <Reveal
                            key={f.title}
                            delay={i * 0.1}
                            className="hover-lift group rounded-2xl border bg-card"
                        >
                            <Link href={f.href} className="block h-full rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                            <span className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                                <Icon name={f.icon} className="size-5" />
                            </span>
                            <h3 className="font-semibold">{f.title}</h3>
                            <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                                {f.text}
                            </p>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="container-page py-8" aria-labelledby="sellers-title">
                <div className="mb-4 flex items-center justify-between">
                    <h2 id="sellers-title" className="text-xl font-bold">
                        فروشندگان برگزیده
                    </h2>
                    <Link href="/sellers" className="text-sm text-gold-700 hover:underline">
                        همه
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sellers.slice(0, 6).map((s, i) => (
                        <Reveal key={s.slug} delay={i * 0.07}>
                            <SellerCard seller={s} />
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="container-page py-8" aria-labelledby="guides-title">
                <h2 id="guides-title" className="mb-4 text-xl font-bold">
                    راهنمای خرید
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {GUIDES.map((g, i) => (
                        <Reveal key={g.slug} delay={i * 0.08}>
                            <Link
                                href={`/guides/${g.slug}`}
                                className="hover-lift block rounded-2xl border bg-card p-5"
                            >
                                <h3 className="font-semibold">{g.title}</h3>
                                <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                                    {g.description}
                                </p>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="container-page py-4" aria-label="دعوت طلافروشان">
                <SellerBanner />
            </section>

            <section className="container-page py-8" aria-labelledby="faq-title">
                <h2 id="faq-title" className="mb-4 text-xl font-bold">
                    پرسش‌های پرتکرار
                </h2>
                <PlatformNotice className="mb-4" />
                <dl className="divide-y rounded-2xl border bg-card">
                    {FAQ.map((f) => (
                        <div key={f.q} className="p-5">
                            <dt className="font-semibold">{f.q}</dt>
                            <dd className="mt-1.5 text-sm leading-7 text-muted-foreground">
                                {f.a}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        </main>
    );
}
