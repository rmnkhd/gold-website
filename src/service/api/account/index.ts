// Statics And Types
import type { GenericResponse } from '@/dto/common';
import type {
    AppNotification,
    Booking,
    ConsumerProfile,
    Favorites,
    LoyaltyRow,
    MyPlan,
    NotifyPrefs,
    Order,
} from '@/dto/order';

// Services
import { api } from '@/service/http-client';

export const GET_PROFILE = 'GET_PROFILE';
export const GET_MY_ORDERS = 'GET_MY_ORDERS';
export const GET_FAVORITES = 'GET_FAVORITES';
export const GET_MY_BOOKINGS = 'GET_MY_BOOKINGS';
export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';
export const GET_MY_PLANS = 'GET_MY_PLANS';
export const GET_LOYALTY = 'GET_LOYALTY';

export const getProfile = (): Promise<GenericResponse<ConsumerProfile>> => api('/v1/consumer/me');

export const updateProfile = (input: {
    name?: string;
    notify?: NotifyPrefs;
}): Promise<GenericResponse<ConsumerProfile>> => api('/v1/consumer/me', { method: 'PUT', body: input });

export const getMyOrders = (): Promise<GenericResponse<Order[]>> => api('/v1/consumer/orders');

export interface CreateOrderInput {
    sellerSlug: string;
    items: { itemId: string; quantity: number }[];
    note?: string;
}

export const createOrder = (input: CreateOrderInput): Promise<GenericResponse<Order>> =>
    api('/v1/consumer/orders', { method: 'POST', body: input });

export const cancelOrder = (id: string): Promise<GenericResponse<Order>> =>
    api(`/v1/consumer/orders/${id}/cancel`, { method: 'POST' });

export const getFavorites = (): Promise<GenericResponse<Favorites>> => api('/v1/consumer/favorites');

export const setFavoriteShop = (slug: string, on: boolean): Promise<GenericResponse<never>> =>
    api(`/v1/consumer/favorites/shops/${encodeURIComponent(slug)}`, { method: on ? 'PUT' : 'DELETE' });

export const setFavoriteItem = (id: string, on: boolean): Promise<GenericResponse<never>> =>
    api(`/v1/consumer/favorites/items/${id}`, { method: on ? 'PUT' : 'DELETE' });

export const saveReview = (
    slug: string,
    input: { rating: number; body: string }
): Promise<GenericResponse<unknown>> =>
    api(`/v1/consumer/sellers/${encodeURIComponent(slug)}/review`, { method: 'PUT', body: input });

export const getMyBookings = (): Promise<GenericResponse<Booking[]>> => api('/v1/consumer/bookings');

export const createBooking = (input: {
    sellerSlug: string;
    slotAt: string;
    note?: string;
}): Promise<GenericResponse<Booking>> => api('/v1/consumer/bookings', { method: 'POST', body: input });

export const cancelBooking = (id: string): Promise<GenericResponse<Booking>> =>
    api(`/v1/consumer/bookings/${id}/cancel`, { method: 'POST' });

export const getNotifications = (): Promise<GenericResponse<{ items: AppNotification[]; unread: number }>> =>
    api('/v1/consumer/notifications');

export const readNotification = (id: string): Promise<GenericResponse<never>> =>
    api(`/v1/consumer/notifications/${id}/read`, { method: 'POST' });

export const readAllNotifications = (): Promise<GenericResponse<never>> =>
    api('/v1/consumer/notifications/read-all', { method: 'POST' });

export const getMyPlans = (): Promise<GenericResponse<MyPlan[]>> => api('/v1/consumer/plans');

export const getLoyalty = (): Promise<GenericResponse<LoyaltyRow[]>> => api('/v1/consumer/loyalty');

/** اشتراک Web Push — شبیه‌سازی: تا ارائه‌دهنده‌ی واقعی (VAPID) وصل نشده فقط ثبت می‌شود */
export const subscribePush = (input: {
    endpoint: string;
    p256dh?: string;
    auth?: string;
}): Promise<GenericResponse<unknown>> =>
    api('/v1/consumer/push-subscriptions', { method: 'POST', body: input });

export const unsubscribePush = (endpoint: string): Promise<GenericResponse<never>> =>
    api('/v1/consumer/push-subscriptions', { method: 'DELETE', body: { endpoint } });
