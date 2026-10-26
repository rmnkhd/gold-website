// Statics And Types
import type { MarketPrices } from '@/dto/market';
import { PRICE_METRICS, TILE_ORDER } from '@/statics/price-metrics';

// Utils And Hooks
import { formatPrice } from '@/utils/number';

const stampFormat = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Asia/Tehran',
});

/** قیمتِ زنده و تأییدشده؛ جز این نباید به‌عنوان «قیمت امروز» در متن صفحه یا توضیح متا بیاید */
export const isVerifiedLive = (p: MarketPrices | undefined): p is MarketPrices =>
    Boolean(p && p.source.startsWith('live:') && !p.stale);

/**
 * جدول قیمت‌ها که سمت سرور رندر می‌شود تا موتورهای جستجو (و مرورگر بدون JS) قیمت واقعی را در HTML ببینند.
 * کارت زنده‌ی مرورگر همان داده را هر ۱۵ ثانیه تازه می‌کند.
 */
export default function PricesSnapshot({ prices }: { prices: MarketPrices | undefined }) {
    if (!prices) return null;
    const live = isVerifiedLive(prices);
    return (
        <section className="mt-8" aria-labelledby="prices-table-title">
            <h2 id="prices-table-title" className="mb-3 text-xl font-bold">
                جدول قیمت طلا و سکه
            </h2>
            <div className="overflow-hidden rounded-2xl border bg-card">
                <table className="w-full text-sm">
                    <caption className="border-b p-3 text-start text-xs text-muted-foreground">
                        {live
                            ? `آخرین قیمت دریافت‌شده: ${stampFormat.format(new Date(prices.updatedAt))}`
                            : 'قیمت نمونه یا کهنه است و مبنای معامله نیست؛ قیمت نهایی را با فروشنده هماهنگ کنید.'}
                    </caption>
                    <thead className="sr-only">
                        <tr>
                            <th scope="col">مورد</th>
                            <th scope="col">قیمت</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {TILE_ORDER.map((key) => {
                            const m = PRICE_METRICS[key];
                            return (
                                <tr key={key}>
                                    <th scope="row" className="p-3 text-start font-medium">
                                        {m.heroLabel}
                                    </th>
                                    <td className="p-3 text-end font-semibold">
                                        {m.tilePrefix}
                                        {formatPrice(prices[key])} {m.unit}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
