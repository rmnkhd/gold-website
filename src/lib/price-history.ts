import { toPersianDigits } from '../utils/number.ts';

export type RangeKey = '7d' | '30d' | '90d' | '1y' | 'all';

export const RANGES: { key: RangeKey; label: string }[] = [
    { key: '7d', label: '۷ روز' },
    { key: '30d', label: '۳۰ روز' },
    { key: '90d', label: '۳ ماه' },
    { key: '1y', label: '۱ سال' },
    { key: 'all', label: 'همه' },
];

/** بازه از `?range=`؛ ناشناخته یا نبود = ۳۰ روز */
export const parseRange = (value: string | string[] | undefined): RangeKey => {
    const v = Array.isArray(value) ? value[0] : value;
    return RANGES.some((r) => r.key === v) ? (v as RangeKey) : '30d';
};

/** شکل JSON بک‌اند `GET /v1/public/prices/history` */
export interface HistoryPoint {
    day: string;
    open: number;
    high: number;
    low: number;
    close: number;
    samples: number;
}

export interface HistorySummary {
    first: number;
    last: number;
    change: number;
    changePercent: number;
    min: number;
    max: number;
    minDay: string;
    maxDay: string;
    average: number;
    days: number;
}

export interface PriceHistory {
    instrument: string;
    range: RangeKey;
    points: HistoryPoint[];
    summary: HistorySummary;
}

export interface ChartPoint {
    x: number;
    y: number;
    day: string;
    close: number;
}

export interface ChartGeometry {
    points: ChartPoint[];
    /** مسیر خط (SVG path) */
    line: string;
    /** مسیر ناحیه‌ی زیر خط، تا کف نمودار بسته */
    area: string;
    min: number;
    max: number;
    /** خط‌های راهنمای افقی از بالا به پایین */
    yTicks: { y: number; value: number }[];
    height: number;
    width: number;
    padding: number;
}

/**
 * هندسه‌ی نمودار خطی بسته‌ها در یک SVG. کمتر از دو نقطه = بدون نمودار (null).
 * زمان از چپ به راست؛ سری ثابت وسط کادر می‌نشیند.
 */
export function buildChart(
    points: HistoryPoint[],
    { width, height, padding = 16 }: { width: number; height: number; padding?: number }
): ChartGeometry | null {
    if (points.length < 2) return null;
    const closes = points.map((p) => p.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;
    const yOf = (v: number): number => (max === min ? padding + innerH / 2 : padding + innerH - ((v - min) / (max - min)) * innerH);
    const pts: ChartPoint[] = points.map((p, i) => ({
        x: Math.round((padding + (i / (points.length - 1)) * innerW) * 100) / 100,
        y: Math.round(yOf(p.close) * 100) / 100,
        day: p.day,
        close: p.close,
    }));
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
    const base = height - padding;
    const area = `${line} L${pts[pts.length - 1].x} ${base} L${pts[0].x} ${base} Z`;
    const yTicks = [0, 1, 2].map((i) => {
        const value = max - ((max - min) * i) / 2;
        return { y: Math.round(yOf(value) * 100) / 100, value: Math.round(value) };
    });
    return { points: pts, line, area, min, max, yTicks, height, width, padding };
}

/** جمله‌ی خلاصه‌ی تغییر بازه؛ پیش از دو روز داده «کافی نیست». */
export function changeSentence(summary: HistorySummary, spanLabel: string): string {
    if (summary.days < 2) return 'برای نمایش روند هنوز داده‌ی کافی ثبت نشده است؛ هر روز به تاریخچه افزوده می‌شود.';
    const pct = toPersianDigits(Math.abs(summary.changePercent).toFixed(summary.changePercent % 1 === 0 ? 0 : 1)).replace('.', '٫');
    if (summary.change === 0) return `در ${spanLabel} گذشته قیمت تقریباً بدون تغییر بوده است.`;
    return summary.change > 0
        ? `در ${spanLabel} گذشته قیمت ${pct}٪ افزایش یافته است.`
        : `در ${spanLabel} گذشته قیمت ${pct}٪ کاهش یافته است.`;
}

/** برچسب کوتاه محور نمودار: مبلغ‌های میلیونی «۲۶٫۲۹ م»، کوچک‌ترها با جداکننده. */
export function compactPrice(value: number): string {
    if (value >= 1_000_000) {
        const m = Math.round((value / 1_000_000) * 100) / 100;
        return `${toPersianDigits(String(m)).replace('.', '٫')} م`;
    }
    return toPersianDigits(new Intl.NumberFormat('en-US').format(value)).replace(/,/g, '٬');
}
