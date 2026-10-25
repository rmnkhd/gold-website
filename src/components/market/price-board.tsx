'use client';

// React
import { useState } from 'react';

// Statics And Types
import type { PriceStatus } from '@/lib/price-status';
import {
    DEFAULT_METRIC,
    PRICE_METRICS,
    TILE_ORDER,
    type MetricKey,
    type PriceValues,
} from '@/statics/price-metrics';

// Components
import { Icon } from '@/components/icon';
import PriceStatusBadge from '@/components/market/price-status-badge';
import CountUp from '@/components/motion/count-up';
import MoltenGold from '@/components/motion/molten-gold';

// Utils And Hooks
import { cn } from '@/lib/utils';
import { formatPrice, toPersianDigits } from '@/utils/number';

interface PriceBoardProps {
    prices: PriceValues;
    status: PriceStatus;
    ariaLabel: string;
    className?: string;
}

/**
 * کارت قیمت لاجوردی: عدد اصلی با «طلای ۱۸ عیار» شروع می‌شود و با زدن روی هر کاشی
 * (سکه امامی، ۲۴ عیار، اونس) همان مقیاس بزرگ نشان داده می‌شود؛ زدن دوباره‌ی کاشی برمی‌گرداند.
 */
export default function PriceBoard({ prices, status, ariaLabel, className }: PriceBoardProps) {
    const [selected, setSelected] = useState<MetricKey>(DEFAULT_METRIC);
    const hero = PRICE_METRICS[selected];
    const down = prices.changePercent < 0;

    return (
        <section
            aria-label={ariaLabel}
            className={cn(
                'bg-navy-glow animate-rise relative overflow-hidden rounded-2xl p-5 pb-16 text-white',
                className
            )}
        >
            <MoltenGold />
            <div className="relative flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs text-brand-200">{hero.heroLabel}</p>
                    <p className="text-gold-sheen mt-1 text-3xl font-extrabold tracking-tight">
                        <CountUp
                            value={prices[hero.key]}
                            format={(n) => formatPrice(Math.round(n))}
                        />
                        <span className="ms-1.5 text-sm font-medium text-brand-200">
                            {hero.unit}
                        </span>
                    </p>
                </div>
                {selected === DEFAULT_METRIC ? (
                    <span
                        className={cn(
                            'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                            down
                                ? 'bg-danger-500/20 text-danger-50'
                                : 'bg-success-500/20 text-success-50'
                        )}
                    >
                        <Icon name={down ? 'trending-down' : 'trending-up'} className="size-3.5" />
                        <span className="latin-nums">
                            {toPersianDigits(Math.abs(prices.changePercent))}٪
                        </span>
                    </span>
                ) : null}
            </div>

            <div
                role="group"
                aria-label="انتخاب قیمت نمایش‌داده‌شده"
                className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center"
            >
                {TILE_ORDER.map((key) => {
                    const m = PRICE_METRICS[key];
                    const active = key === selected;
                    return (
                        <button
                            key={key}
                            type="button"
                            aria-pressed={active}
                            title={active ? 'بازگشت به طلای ۱۸ عیار' : `نمایش ${m.heroLabel}`}
                            onClick={() => setSelected(active ? DEFAULT_METRIC : key)}
                            className={cn(
                                'cursor-pointer rounded-xl px-1 py-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold-300',
                                active
                                    ? 'bg-white/15 ring-1 ring-gold-300/60'
                                    : 'hover:bg-white/10 active:bg-white/15'
                            )}
                        >
                            <span className="block text-[11px] text-brand-200">{m.label}</span>
                            <span className="mt-0.5 block text-sm font-semibold">
                                {m.tilePrefix}
                                {formatPrice(Math.round(prices[key] / m.tileDivisor))}
                                {m.tileSuffix}
                            </span>
                        </button>
                    );
                })}
            </div>
            <PriceStatusBadge status={status} className="relative mt-3" />
        </section>
    );
}
