// React
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Statics And Types
import { GUIDES } from '@/statics/guides';
import { getInstrument, PRICE_INSTRUMENTS } from '@/statics/price-instruments';

// Components
import SellerBanner from '@/components/marketing/seller-banner';
import PriceChart from '@/components/market/price-chart';
import { isVerifiedLive } from '@/components/market/prices-snapshot';
import JsonLd from '@/components/seo/json-ld';

// Services
import { getMarketPricesServer, getPriceHistoryServer } from '@/service/api/market';

// Utils And Hooks
import { SITE_URL } from '@/constants/brand';
import { jalaliLabel, tehranIso } from '@/lib/jalali-label';
import { buildPriceFaq } from '@/lib/price-faq';
import { changeSentence, parseRange, RANGES, type RangeKey } from '@/lib/price-history';
import { breadcrumbLd, pageMetadata } from '@/lib/seo';
import { formatPrice, toPersianDigits } from '@/utils/number';

/** نتیجه‌ی بک‌اند ۵ دقیقه کش می‌شود (`getPriceHistoryServer`)؛ خودِ صفحه به‌خاطر `?range=` پویاست */
export const dynamicParams = false;

export function generateStaticParams() {
    return PRICE_INSTRUMENTS.map((i) => ({ instrument: i.slug }));
}

const SPAN_LABEL: Record<RangeKey, string> = {
    '7d': '۷ روز',
    '30d': '۳۰ روز',
    '90d': '۳ ماه',
    '1y': 'یک سال',
    all: 'کل دوره‌ی ثبت‌شده',
};

export async function generateMetadata({ params }: { params: Promise<{ instrument: string }> }): Promise<Metadata> {
    const { instrument: slug } = await params;
    const inst = getInstrument(slug);
    if (!inst) return {};
    const date = jalaliLabel(tehranIso(new Date()), { weekday: true });
    const prices = await getMarketPricesServer();
    const live = isVerifiedLive(prices);
    const description = live
        ? `قیمت ${inst.title} ${inst.unit} ${formatPrice(prices[inst.key])} ${inst.currency}؛ نمودار و تاریخچه‌ی روزانه، کمترین و بیشترین قیمت و روند تغییر. ${inst.intro}`
        : `نمودار و تاریخچه‌ی روزانه‌ی قیمت ${inst.title}، کمترین و بیشترین قیمت و روند تغییر. ${inst.intro}`;
    return pageMetadata({
        title: `قیمت ${inst.title} امروز ${date}`,
        description,
        path: `/prices/${inst.slug}`,
    });
}

export default async function InstrumentPricePage({
    params,
    searchParams,
}: {
    params: Promise<{ instrument: string }>;
    searchParams: Promise<{ range?: string | string[] }>;
}) {
    const { instrument: slug } = await params;
    const inst = getInstrument(slug);
    if (!inst) notFound();
    const range = parseRange((await searchParams).range);
    const [prices, history] = await Promise.all([getMarketPricesServer(), getPriceHistoryServer(inst.key, range)]);

    const points = history?.points ?? [];
    const summary = history?.summary;
    const live = isVerifiedLive(prices);
    const livePrice = live ? prices[inst.key] : undefined;
    const lastClose = points.length ? points[points.length - 1] : undefined;
    const todayIso = tehranIso(new Date());
    const todayLabel = jalaliLabel(todayIso, { weekday: true });
    const since = history?.range === 'all' ? points[0]?.day : undefined;
    const faq = buildPriceFaq({
        title: inst.title,
        unit: inst.unit,
        currency: inst.currency,
        livePrice,
        summary: summary ?? { first: 0, last: 0, change: 0, changePercent: 0, min: 0, max: 0, minDay: '', maxDay: '', average: 0, days: 0 },
        spanLabel: SPAN_LABEL[range],
        sinceIso: since,
    });
    const relatedGuides = GUIDES.filter((g) => inst.guides.includes(g.slug));
    const others = PRICE_INSTRUMENTS.filter((i) => i.slug !== inst.slug);
    const rows = [...points].reverse().slice(0, 31);

    return (
        <main className="container-page max-w-4xl py-8">
            <JsonLd
                data={breadcrumbLd([
                    { name: 'قیمت طلا و سکه', path: '/prices' },
                    { name: `قیمت ${inst.title}`, path: `/prices/${inst.slug}` },
                ])}
            />
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: faq.map((f) => ({
                        '@type': 'Question',
                        name: f.q,
                        acceptedAnswer: { '@type': 'Answer', text: f.a },
                    })),
                }}
            />
            {points.length >= 2 ? (
                <JsonLd
                    data={{
                        '@context': 'https://schema.org',
                        '@type': 'Dataset',
                        name: `تاریخچه‌ی روزانه‌ی قیمت ${inst.title}`,
                        description: `قیمت روزانه‌ی ${inst.title} (${inst.unit}، ${inst.currency}) — اولین، بالاترین، پایین‌ترین و آخرین قیمت هر روز به وقت تهران.`,
                        url: `${SITE_URL}/prices/${inst.slug}`,
                        inLanguage: 'fa',
                        temporalCoverage: `${points[0].day}/${points[points.length - 1].day}`,
                        creator: { '@type': 'Organization', name: 'زرینه', url: SITE_URL },
                        variableMeasured: `${inst.title} (${inst.currency})`,
                    }}
                />
            ) : null}

            <nav aria-label="مسیر صفحه" className="mb-3 text-xs text-muted-foreground">
                <Link href="/prices" className="hover:underline">
                    قیمت طلا و سکه
                </Link>
                <span aria-hidden="true"> › </span>
                <span>{inst.title}</span>
            </nav>
            <h1 className="text-2xl font-extrabold lg:text-3xl">قیمت {inst.title} امروز</h1>
            <p className="mt-1 text-sm text-muted-foreground">{todayLabel}</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{inst.intro}</p>

            <section className="mt-6 rounded-2xl border bg-card p-5" aria-label="قیمت فعلی">
                {livePrice !== undefined ? (
                    <>
                        <p className="text-xs text-muted-foreground">
                            {inst.unit} · قیمت زنده
                        </p>
                        <p className="mt-1 text-3xl font-extrabold text-gold-700">
                            {formatPrice(livePrice)} <span className="text-base font-medium text-muted-foreground">{inst.currency}</span>
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-xs text-muted-foreground">قیمت زنده در این لحظه به‌روز نیست</p>
                        {lastClose ? (
                            <p className="mt-1 text-xl font-bold">
                                آخرین قیمت پایانی ثبت‌شده ({jalaliLabel(lastClose.day)}): {formatPrice(lastClose.close)}{' '}
                                <span className="text-sm font-medium text-muted-foreground">{inst.currency}</span>
                            </p>
                        ) : (
                            <p className="mt-1 text-sm">هنوز قیمتی ثبت نشده است.</p>
                        )}
                    </>
                )}
            </section>

            <section className="mt-6" aria-labelledby="history-title">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h2 id="history-title" className="text-xl font-bold">
                        نمودار قیمت {inst.title}
                    </h2>
                    <div className="flex flex-wrap gap-1.5" role="group" aria-label="بازه‌ی زمانی">
                        {RANGES.map((r) => (
                            <Link
                                key={r.key}
                                href={r.key === '30d' ? `/prices/${inst.slug}` : `/prices/${inst.slug}?range=${r.key}`}
                                aria-current={r.key === range ? 'true' : undefined}
                                rel="nofollow"
                                className={
                                    r.key === range
                                        ? 'rounded-full bg-brand-900 px-3 py-1 text-xs font-semibold text-white'
                                        : 'rounded-full border px-3 py-1 text-xs hover:border-gold-300'
                                }
                            >
                                {r.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <PriceChart points={points} title={`قیمت ${inst.title}`} currency={inst.currency} />
                {summary && summary.days >= 2 ? (
                    <>
                        <p className="mt-3 text-sm leading-7">{changeSentence(summary, SPAN_LABEL[range])}</p>
                        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                ['کمترین', summary.min, summary.minDay],
                                ['بیشترین', summary.max, summary.maxDay],
                                ['میانگین پایانی', summary.average, ''],
                                ['تغییر', summary.change, ''],
                            ].map(([label, value, day]) => (
                                <div key={String(label)} className="rounded-xl border bg-card p-3">
                                    <dt className="text-xs text-muted-foreground">{label}</dt>
                                    <dd className="mt-1 text-sm font-bold" dir="ltr">
                                        {label === 'تغییر'
                                            ? `${Number(value) > 0 ? '+' : ''}${formatPrice(Number(value))} (${toPersianDigits(summary.changePercent.toFixed(1))}٪)`
                                            : formatPrice(Number(value))}
                                    </dd>
                                    {day ? <dd className="text-[11px] text-muted-foreground">{jalaliLabel(String(day))}</dd> : null}
                                </div>
                            ))}
                        </dl>
                    </>
                ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                        هنوز داده‌ی کافی برای نمایش روند ثبت نشده است؛ زرینه قیمت را هر روز ثبت می‌کند.
                    </p>
                )}
            </section>

            {rows.length > 0 ? (
                <section className="mt-8" aria-labelledby="table-title">
                    <h2 id="table-title" className="mb-3 text-xl font-bold">
                        قیمت روزانه‌ی {inst.title}
                    </h2>
                    <div className="overflow-hidden rounded-2xl border bg-card">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs text-muted-foreground">
                                <tr>
                                    <th scope="col" className="p-3 text-start font-medium">
                                        تاریخ
                                    </th>
                                    <th scope="col" className="p-3 text-start font-medium">
                                        پایانی ({inst.currency})
                                    </th>
                                    <th scope="col" className="p-3 text-start font-medium">
                                        کمترین
                                    </th>
                                    <th scope="col" className="p-3 text-start font-medium">
                                        بیشترین
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((p) => (
                                    <tr key={p.day} className="border-t">
                                        <td className="p-3">{jalaliLabel(p.day, { weekday: true })}</td>
                                        <td className="p-3 font-semibold">{formatPrice(p.close)}</td>
                                        <td className="p-3 text-muted-foreground">{formatPrice(p.low)}</td>
                                        <td className="p-3 text-muted-foreground">{formatPrice(p.high)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}

            <section className="mt-8" aria-labelledby="about-title">
                <h2 id="about-title" className="mb-3 text-xl font-bold">
                    درباره‌ی قیمت {inst.title}
                </h2>
                <div className="space-y-3 text-sm leading-8">
                    {inst.about.map((p) => (
                        <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                </div>
                <p className="mt-4 rounded-xl border bg-muted/40 p-3 text-xs leading-7 text-muted-foreground">
                    روش: قیمت‌ها از منابع قیمت‌دهی دریافت و پیش از ثبت اعتبارسنجی می‌شوند؛ نمودار، اولین تا آخرین قیمت هر روز را به وقت تهران
                    خلاصه می‌کند. این صفحه اطلاع‌رسانی است و توصیه‌ی خرید یا فروش نیست؛ قیمت نهایی معامله را فروشنده یا بازار تعیین می‌کند.
                </p>
            </section>

            <section className="mt-8" aria-labelledby="faq-title">
                <h2 id="faq-title" className="mb-3 text-xl font-bold">
                    پرسش‌های پرتکرار
                </h2>
                <div className="space-y-2">
                    {faq.map((f) => (
                        <details key={f.q} className="rounded-xl border bg-card p-4">
                            <summary className="cursor-pointer text-sm font-semibold">{f.q}</summary>
                            <p className="mt-2 text-sm leading-8 text-muted-foreground">{f.a}</p>
                        </details>
                    ))}
                </div>
            </section>

            <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="ابزارها و فروشندگان">
                <Link href="/calculator" className="rounded-2xl border bg-card p-4 transition-colors hover:border-gold-300">
                    <p className="font-semibold">محاسبه‌گر قیمت جواهر</p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">اجرت، سود و مالیات را جدا ببینید.</p>
                </Link>
                <Link href="/compare" className="rounded-2xl border bg-card p-4 transition-colors hover:border-gold-300">
                    <p className="font-semibold">مقایسه‌ی فروشندگان</p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">قیمت یک جواهر نزد چند فروشنده.</p>
                </Link>
                <Link href="/sellers" className="rounded-2xl border bg-card p-4 transition-colors hover:border-gold-300">
                    <p className="font-semibold">طلافروشان معتبر</p>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">فهرست فروشندگان با نشان تأیید.</p>
                </Link>
            </section>

            {relatedGuides.length > 0 ? (
                <section className="mt-8" aria-labelledby="guides-title">
                    <h2 id="guides-title" className="mb-3 text-xl font-bold">
                        بیشتر بخوانید
                    </h2>
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {relatedGuides.map((g) => (
                            <li key={g.slug}>
                                <Link href={`/guides/${g.slug}`} className="block rounded-xl border bg-card p-3 text-sm hover:border-gold-300">
                                    {g.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            <SellerBanner className="mt-8" />

            <nav className="mt-8" aria-label="قیمت‌های دیگر">
                <h2 className="mb-3 text-base font-bold">قیمت‌های دیگر</h2>
                <ul className="flex flex-wrap gap-2">
                    {others.map((i) => (
                        <li key={i.slug}>
                            <Link href={`/prices/${i.slug}`} className="inline-block rounded-full border px-3 py-1.5 text-xs hover:border-gold-300">
                                قیمت {i.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </main>
    );
}
