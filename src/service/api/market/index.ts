// Statics And Types
import type { GenericResponse } from '@/dto/common';
import type {
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
    params: { city?: string; q?: string } = {}
): Promise<GenericResponse<Seller[]>> => {
    try {
        return await api<Seller[]>('/v1/public/sellers', {
            auth: false,
            revalidate: ISR,
            query: { ...params, limit: 60 },
        });
    } catch {
        return { data: [], total: 0 };
    }
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
