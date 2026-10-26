/** DTOهای سایت = شکل JSON بک‌اند (`gold-backend/docs/openapi.yaml`)؛ وزن‌ها گرم، مبالغ تومان */

/** قیمت‌های بازار (تومان) */
export interface MarketPrices {
    gold18: number;
    gold24: number;
    coinEmami: number;
    coinHalf: number;
    coinQuarter: number;
    ounceUsd: number;
    /** درصد تغییر نسبت به دیروز */
    changePercent: number;
    /** ISO */
    updatedAt: string;
    /** منبع قیمت؛ تا وصل شدن فید واقعی «simulated» است */
    source: string;
    /** سن آخرین قرائت هنگام پاسخ (ثانیه) */
    feedState?: 'disabled' | 'pending' | 'rejected' | 'verified';
    ageSeconds: number;
    /** بیش از ۵ دقیقه بی‌قرائت تازه */
    stale: boolean;
}

export interface CatalogItem {
    imageUrl: string;
    conditions: string;
    id: string;
    title: string;
    karat: number;
    weightGram: number;
    wagePercent: number;
    inStock: boolean;
    /** برآورد یک قطعه با اجرت، سود و مالیات همان فروشگاه و قیمت روز (سرور)؛ ۰ = نامشخص */
    estimatedTotal: number;
}

export interface Seller {
    slug: string;
    name: string;
    city: string;
    district: string;
    address: string;
    phone: string;
    hours: string;
    rating: number;
    reviewCount: number;
    /** پروانه صنفی بررسی شده */
    verified: boolean;
    about: string;
    specialties: string[];
    lat: number | null;
    lng: number | null;
    /** ISO؛ آخرین تغییر صفحه یا کاتالوگ عمومی (lastmod sitemap) */
    updatedAt: string;
    catalog: CatalogItem[];
}

export interface SellerReview {
    id: string;
    consumerName: string;
    rating: number;
    body: string;
    reply: string;
    createdAt: string;
}

export interface CompareRow {
    slug: string;
    name: string;
    city: string;
    rating: number;
    verified: boolean;
    wagePercent: number;
    estimatedTotal: number;
}

export interface MarketIndexBucket {
    city: string;
    kind: string;
    shopCount: number;
    sampleSize: number;
    avgWagePercent: number;
}

export interface MarketIndex {
    buckets: MarketIndexBucket[];
    minShops: number;
    windowDays: number;
}

export interface Certificate {
    code: string;
    itemTitle: string;
    karat: number;
    weightGram: number;
    status: 'valid' | 'revoked';
    issuedAt: string;
    note: string;
    verifyUrl: string;
    shop: { name: string; slug: string; city: string; verified: boolean };
}

export interface GuideSection {
    heading: string;
    paragraphs: string[];
}

export interface Guide {
    slug: string;
    title: string;
    description: string;
    /** نمایش فارسی */
    publishedAt: string;
    /** ISO (YYYY-MM-DD) برای داده‌ی ساخت‌یافته و sitemap */
    publishedIso: string;
    readingMinutes: number;
    sections: GuideSection[];
}

/** مالیات و پیش‌فرض‌های محاسبه‌گر عمومی (تنظیم سرور) */
export interface CalculatorConfig {
    vatPercent: number;
    defaultWagePercent: number;
    defaultProfitPercent: number;
    defaultWeightGram: number;
    karats: number[];
}

/** نتیجه‌ی محاسبه‌ی سرور برای یک جواهر */
export interface CalculatorResult {
    price18: number;
    karat: number;
    weightGram: number;
    pricePerGram: number;
    wagePercent: number;
    profitPercent: number;
    vatPercent: number;
    goldValue: number;
    wage: number;
    profit: number;
    vat: number;
    total: number;
}
