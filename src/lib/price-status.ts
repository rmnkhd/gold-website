import { toPersianDigits } from '../utils/number.ts';

/** بی‌قرائت تازه بیش از این = کهنه (هم‌خوان با `PRICE_STALE_AFTER` بک‌اند) */
export const STALE_AFTER_SECONDS = 300;

export type PriceState = 'live' | 'stale' | 'sample' | 'offline';
export type FeedState = 'disabled' | 'pending' | 'rejected' | 'verified';

export interface PriceFreshness {
    feedState?: FeedState;
    source: string;
    stale: boolean;
    ageSeconds: number;
}

export interface PriceStatus {
    feedState?: FeedState;
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
    const common = { ageSeconds, source: p.source, feedState: p.feedState };
    if (!p.source.startsWith('live:')) return { state: 'sample', ...common };
    if (ctx.failed) return { state: 'offline', ...common };
    if (p.stale || ageSeconds > STALE_AFTER_SECONDS) return { state: 'stale', ...common };
    return { state: 'live', ...common };
};

/** وضعیت تأیید منبع از سن و نوع قیمت مستقل است؛ اتصال به معنی تأیید قیمت نیست. */
export const priceStatusDetail = (status: PriceStatus): string => {
    if (status.state === 'sample') {
        if (status.feedState === 'disabled') return 'فید زنده غیرفعال است';
        if (status.feedState === 'rejected') return 'دادهٔ منابع تأیید نشد';
        return 'قیمت زنده هنوز تأیید نشده';
    }
    if (status.state === 'live') return ageLabel(status.ageSeconds);
    const age = `آخرین به‌روزرسانی ${ageLabel(status.ageSeconds)}`;
    return status.state === 'stale' && status.feedState === 'rejected'
        ? `دادهٔ منابع تأیید نشد · ${age}`
        : age;
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
