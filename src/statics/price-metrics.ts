/** مقیاس‌های قابل‌نمایش کارت قیمت؛ با زدن روی کاشی‌های پایین، عدد اصلی کارت عوض می‌شود */
export type MetricKey = 'gold18' | 'gold24' | 'coinEmami' | 'ounceUsd';

export interface PriceValues {
    gold18: number;
    gold24: number;
    coinEmami: number;
    ounceUsd: number;
    changePercent: number;
}

export interface MetricDef {
    key: MetricKey;
    /** برچسب کاشی */
    label: string;
    /** برچسب بالای عدد اصلی */
    heroLabel: string;
    /** واحد کنار عدد اصلی */
    unit: string;
    /** کاشی عدد را تقسیم و پسوند/پیشوند می‌دهد (م = میلیون، ه = هزار) */
    tileDivisor: number;
    tilePrefix: string;
    tileSuffix: string;
}

export const DEFAULT_METRIC: MetricKey = 'gold18';

export const PRICE_METRICS: Record<MetricKey, MetricDef> = {
    gold18: {
        key: 'gold18',
        label: '۱۸ عیار',
        heroLabel: 'هر گرم طلای ۱۸ عیار',
        unit: 'تومان',
        tileDivisor: 1_000,
        tilePrefix: '',
        tileSuffix: ' ه',
    },
    coinEmami: {
        key: 'coinEmami',
        label: 'سکه امامی',
        heroLabel: 'سکه امامی (تمام‌سکه)',
        unit: 'تومان',
        tileDivisor: 1_000_000,
        tilePrefix: '',
        tileSuffix: ' م',
    },
    gold24: {
        key: 'gold24',
        label: '۲۴ عیار',
        heroLabel: 'هر گرم طلای ۲۴ عیار',
        unit: 'تومان',
        tileDivisor: 1_000,
        tilePrefix: '',
        tileSuffix: ' ه',
    },
    ounceUsd: {
        key: 'ounceUsd',
        label: 'اونس',
        heroLabel: 'اونس جهانی طلا',
        unit: 'دلار',
        tileDivisor: 1,
        tilePrefix: '$',
        tileSuffix: '',
    },
};

/** ترتیب کاشی‌های ردیف پایین */
export const TILE_ORDER: MetricKey[] = ['coinEmami', 'gold24', 'ounceUsd'];
