export type OrderStatus = 'new' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
    imageUrl: string;
    conditions: string;
    itemId?: string;
    title: string;
    karat: number;
    weightGram: number;
    quantity: number;
}

/** سفارشِ مشتری به یک فروشنده (از صفحه‌ی فروشنده در سایت) */
export interface Order {
    trackingCode: string;
    cancellationReason: string;
    shopPhone: string;
    id: string;
    number: string;
    shopSlug: string;
    shopName: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    note: string;
    status: OrderStatus;
    /** ISO */
    createdAt: string;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
    new: 'در انتظار تأیید فروشنده',
    confirmed: 'تأیید شد',
    ready: 'آماده‌ی تحویل',
    completed: 'تحویل شد',
    cancelled: 'لغو شد',
};

export interface NotifyPrefs {
    sms: boolean;
    bale: boolean;
    eitaa: boolean;
    push: boolean;
}

export interface ConsumerProfile {
    id: string;
    name: string;
    phone: string;
    notify: NotifyPrefs;
}

export interface FavoriteShop {
    slug: string;
    name: string;
    city: string;
    rating: number;
    verified: boolean;
}

export interface FavoriteItem {
    imageUrl: string;
    conditions: string;
    wagePercent: number;
    inStock: boolean;
    /** برآورد یک قطعه از سرور؛ ۰ = نامشخص */
    estimatedTotal: number;
    id: string;
    title: string;
    karat: number;
    weightGram: number;
    shopSlug: string;
    shopName: string;
}

export interface Favorites {
    shops: FavoriteShop[];
    items: FavoriteItem[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'done' | 'cancelled';

export interface Booking {
    id: string;
    shopSlug: string;
    shopName: string;
    customerName: string;
    customerPhone: string;
    slotAt: string;
    note: string;
    status: BookingStatus;
}

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
    pending: 'در انتظار تأیید',
    confirmed: 'تأیید شد',
    declined: 'رد شد',
    done: 'انجام شد',
    cancelled: 'لغو شد',
};

export interface AppNotification {
    id: string;
    channel: string;
    subject: string;
    body: string;
    kind: string;
    status: string;
    createdAt: string;
    readAt: string | null;
}

export interface MyPlan {
    id: string;
    shopSlug: string;
    shopName: string;
    kind: 'installment' | 'gold_saving';
    title: string;
    totalToman: number;
    downToman: number;
    targetGram: number;
    savedGram: number;
    paidToman: number;
    status: 'active' | 'completed' | 'cancelled' | 'delivered';
    createdAt: string;
    nextDue: string | null;
}

export interface LoyaltyRow {
    shopSlug: string;
    shopName: string;
    points: number;
    tier: 'vip' | 'regular' | 'new';
    redeemableToman: number;
}
