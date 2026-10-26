// Statics And Types
import type { GenericResponse } from '@/dto/common';
import type {
    CalculatorConfig,
    CalculatorResult,
    Certificate,
    CompareRow,
    MarketIndex,
    MarketPrices,
    Seller,
    SellerReview,
} from '@/dto/market';

// Services
import { api, ApiError } from '@/service/http-client';

export const GET_MARKET_PRICES = 'GET_MARKET_PRICES';
export const GET_SELLERS = 'GET_SELLERS';
export const GET_SELLER = 'GET_SELLER';
export const GET_SELLER_REVIEWS = 'GET_SELLER_REVIEWS';
export const GET_COMPARE = 'GET_COMPARE';
export const GET_MARKET_INDEX = 'GET_MARKET_INDEX';

/** صفحه‌های سئو سمت سرور با کش ۶۰ ثانیه‌ای می‌خوانند؛ سمت مرورگر `revalidate` بی‌اثر است */
const ISR = 60;

export const getMarketPrices = (): Promise<GenericResponse<MarketPrices>> =>
    api('/v1/public/prices', { auth: false });

/** برای صفحه‌های سئو (سمت سرور)؛ بک‌اند در دسترس نباشد `undefined` می‌دهد تا صفحه نشکند */
export const getMarketPricesServer = async (): Promise<MarketPrices | undefined> => {
    try {
        return (await api<MarketPrices>('/v1/public/prices', { auth: false, revalidate: ISR })).data;
    } catch {
        return undefined;
    }
};

/** هر مصرف‌کننده‌ی قیمت همین گزینه‌ها را می‌گیرد: تازه‌سازی هر ۱۵ ثانیه و هنگام بازگشت به تب */
export const marketPricesOptions = {
    queryKey: [GET_MARKET_PRICES],
    queryFn: getMarketPrices,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
} as const;

/** بک‌اند در دسترس نباشد (مثلاً هنگام build) فهرست خالی برمی‌گرداند تا صفحه نشکند */
export const getSellers = async (
    params: { city?: string; q?: string; limit?: number; offset?: number } = {}
): Promise<GenericResponse<Seller[]>> => {
    try {
        return await api<Seller[]>('/v1/public/sellers', {
            auth: false,
            revalidate: ISR,
            query: { limit: 60, ...params },
        });
    } catch {
        return { data: [], total: 0 };
    }
};

const SELLERS_PAGE = 200;
const SELLERS_MAX_PAGES = 50;

/** همه‌ی فروشندگان عمومی صفحه‌به‌صفحه (برای sitemap و فهرست شهرها)؛ سقف ایمنی ۱۰هزار */
export const getAllSellers = async (): Promise<Seller[]> => {
    const all: Seller[] = [];
    for (let page = 0; page < SELLERS_MAX_PAGES; page++) {
        const res = await getSellers({ limit: SELLERS_PAGE, offset: page * SELLERS_PAGE });
        const rows = res.data ?? [];
        all.push(...rows);
        if (rows.length < SELLERS_PAGE || all.length >= (res.total ?? 0)) break;
    }
    return all;
};

export const getSellerBySlug = async (slug: string): Promise<Seller | undefined> => {
    try {
        return (await api<Seller>(`/v1/public/sellers/${encodeURIComponent(slug)}`, { auth: false, revalidate: ISR }))
            .data;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return undefined;
        throw error;
    }
};

export const getSellerReviews = (slug: string): Promise<GenericResponse<SellerReview[]>> =>
    api(`/v1/public/sellers/${encodeURIComponent(slug)}/reviews`, { auth: false });

export const getCompare = (params: {
    karat: number;
    weight: number;
    city?: string;
}): Promise<GenericResponse<{ karat: number; price18: number; sellers: CompareRow[] }>> => api('/v1/public/compare', { auth: false, query: params });

export const GET_CALCULATOR_CONFIG = 'GET_CALCULATOR_CONFIG';
export const GET_CALCULATE = 'GET_CALCULATE';

/** مالیات و پیش‌فرض‌های محاسبه‌گر؛ همه از سرور */
export const getCalculatorConfig = (): Promise<GenericResponse<CalculatorConfig>> =>
    api('/v1/public/calculator-config', { auth: false });

/** محاسبه‌ی قیمت جواهر با موتور فاکتور سرور */
export const calculateJewelry = (params: {
    karat: number;
    weight: number;
    wagePercent: number;
    profitPercent: number;
}): Promise<GenericResponse<CalculatorResult>> => api('/v1/public/calculate', { auth: false, query: params });

export const getMarketIndex = (): Promise<GenericResponse<MarketIndex>> =>
    api('/v1/public/market-index', { auth: false });

export const getCertificate = async (code: string): Promise<Certificate | undefined> => {
    try {
        return (await api<Certificate>(`/v1/public/certificates/${encodeURIComponent(code)}`, { auth: false })).data;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return undefined;
        throw error;
    }
};
