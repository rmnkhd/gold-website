'use client';

// React
// Components
import { Icon } from '@/components/icon';

// Utils And Hooks
import { useMarketPrices } from '@/hooks/use-market-prices';
import { formatPrice } from '@/utils/number';

/** نوار لغزان قیمت‌ها زیر هیرو؛ با بردن ماوس می‌ایستد */
export default function PriceTicker() {
    const { prices: p, status } = useMarketPrices(5000);
    if (!p || !status) return null;

    const items = [
        { label: 'طلای ۱۸ عیار', value: `${formatPrice(p.gold18)} تومان` },
        { label: 'طلای ۲۴ عیار', value: `${formatPrice(p.gold24)} تومان` },
        { label: 'سکه امامی', value: `${formatPrice(p.coinEmami)} تومان` },
        { label: 'نیم‌سکه', value: `${formatPrice(p.coinHalf)} تومان` },
        { label: 'ربع‌سکه', value: `${formatPrice(p.coinQuarter)} تومان` },
        { label: 'اونس جهانی', value: `$${formatPrice(p.ounceUsd)}` },
    ];

    const caveat =
        status.state === 'live'
            ? null
            : { sample: 'قیمت نمونه', stale: 'قیمت کهنه', offline: 'آفلاین · آخرین قیمت' }[
                  status.state
              ];

    return (
        <div
            className="marquee bg-navy-deep overflow-hidden border-y border-white/10 text-brand-100"
            role="marquee"
            aria-label="قیمت‌های بازار"
        >
            <div className="animate-marquee flex w-max">
                {[0, 1].map((copy) => (
                    <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                        {caveat ? (
                            <li className="px-6 py-2.5 text-xs font-semibold text-warning-500">
                                {caveat}
                            </li>
                        ) : null}
                        {items.map((it) => (
                            <li
                                key={it.label}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm"
                            >
                                <Icon name="coins" className="size-4 text-gold-400" />
                                <span className="text-brand-200">{it.label}</span>
                                <span className="font-bold text-gold-300">{it.value}</span>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}
