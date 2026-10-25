import { toPersianDigits } from '../utils/number.ts';

/** بی‌قرائت تازه بیش از این = کهنه (هم‌خوان با `PRICE_STALE_AFTER` بک‌اند) */
export const STALE_AFTER_SECONDS = 300;

export type PriceState = 'live' | 'stale' | 'sample' | 'offline';

export interface PriceFreshness {
    source: string;
    stale: boolean;
    ageSeconds: number;
}

export interface PriceStatus {
    source?: string;
    state: PriceState;
    /** سن تخمینی قیمت (ثانیه) = سن سمت سرور + زمان سپری‌شده از دریافت */
    ageSeconds: number;
}

/**
 * وضعیت قیمت برای نمایش: فقط `live:*`ِ تازه و دریافت‌شده «زنده» است.
 * `offline` وقتی درخواست آخر شکست خورده ولی قیمتِ قبلی را داریم (آخرین قیمت با برچسب).
 */
export const describePrice = (
    p: PriceFreshness,
    ctx: { elapsedSeconds: number; failed: boolean }
): PriceStatus => {
    const ageSeconds = Math.max(0, Math.round(p.ageSeconds + ctx.elapsedSeconds));
    if (!p.source.startsWith('live:')) return { state: 'sample', ageSeconds, source: p.source };
    if (ctx.failed) return { state: 'offline', ageSeconds, source: p.source };
    if (p.stale || ageSeconds > STALE_AFTER_SECONDS) return { state: 'stale', ageSeconds, source: p.source };
    return { state: 'live', ageSeconds, source: p.source };
};

/** «۴ ثانیه پیش» / «۲ دقیقه پیش» … */
export const ageLabel = (seconds: number): string => {
    const s = Math.max(0, Math.floor(seconds));
    if (s < 1) return 'همین الان';
    if (s < 60) return `${toPersianDigits(s)} ثانیه پیش`;
    if (s < 3600) return `${toPersianDigits(Math.floor(s / 60))} دقیقه پیش`;
    if (s < 86400) return `${toPersianDigits(Math.floor(s / 3600))} ساعت پیش`;
    return `${toPersianDigits(Math.floor(s / 86400))} روز پیش`;
};
