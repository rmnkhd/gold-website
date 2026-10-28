// React
import Link from 'next/link';

// Statics And Types
import type { PriceInstrument } from '@/statics/price-instruments';
import type { HistorySummary } from '@/lib/price-history';

// Utils And Hooks
import { cn } from '@/lib/utils';
import { formatPrice, toPersianDigits } from '@/utils/number';

export interface InstrumentCard {
    instrument: PriceInstrument;
    summary: HistorySummary | undefined;
}

/** کارت‌های پیوند به صفحه‌ی تاریخچه‌ی هر ابزار؛ تغییر ۷ روز فقط وقتی داده هست. */
export default function InstrumentLinks({ cards }: { cards: InstrumentCard[] }) {
    return (
        <section className="mt-10" aria-labelledby="instrument-links-title">
            <h2 id="instrument-links-title" className="mb-1 text-xl font-bold">
                نمودار و تاریخچه‌ی قیمت
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">برای هر ابزار، نمودار روزانه، کمترین و بیشترین قیمت و روند تغییر را ببینید.</p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map(({ instrument: i, summary }) => {
                    const has = summary && summary.days >= 2;
                    return (
                        <li key={i.slug}>
                            <Link href={`/prices/${i.slug}`} className="hover-lift block rounded-2xl border bg-card p-4 transition-colors hover:border-gold-300">
                                <p className="font-semibold">قیمت {i.title}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {summary && summary.days > 0 ? `آخرین قیمت پایانی: ${formatPrice(summary.last)} ${i.currency}` : 'تاریخچه در حال تکمیل است'}
                                </p>
                                {has ? (
                                    <p
                                        className={cn(
                                            'mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold',
                                            summary.change >= 0 ? 'bg-success-500/15 text-success-700' : 'bg-danger-500/15 text-danger-700'
                                        )}
                                        dir="ltr"
                                    >
                                        {`${summary.change > 0 ? '+' : ''}${toPersianDigits(summary.changePercent.toFixed(1))}٪ در ${toPersianDigits(summary.days)} روز`}
                                    </p>
                                ) : null}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
