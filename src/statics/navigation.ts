// Statics And Types
import type { IconName } from '@/components/icon';

export interface NavItem {
    href: string;
    label: string;
    icon: IconName;
}

/** منوی مردم: هدر دسکتاپ و نوار پایین موبایل (PWA) */
export const MAIN_NAV: NavItem[] = [
    { href: '/', label: 'خانه', icon: 'home' },
    { href: '/calculator', label: 'محاسبه‌گر', icon: 'calculator' },
    { href: '/sellers', label: 'فروشندگان', icon: 'store' },
    { href: '/compare', label: 'مقایسه', icon: 'compare' },
    { href: '/guides', label: 'راهنما', icon: 'book' },
];

/** نوار پایین موبایل: منوی اصلی + حساب من */
export const BOTTOM_NAV: NavItem[] = [
    ...MAIN_NAV,
    { href: '/account', label: 'حساب من', icon: 'user' },
];
