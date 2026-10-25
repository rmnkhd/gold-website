import { z } from 'zod';

/** شماره موبایل ایران: ۰۹ + ۹ رقم */
export const IRAN_MOBILE = /^09\d{9}$/;

export const OTP_LENGTH = 6;

export const loginSchema = z.object({
    phone: z.string().regex(IRAN_MOBILE, 'شماره موبایل معتبر نیست'),
    code: z.string(),
    name: z.string(),
});

export type LoginValues = z.infer<typeof loginSchema>;

/** بعد از ورود به کجا برگردیم؛ فقط مسیر داخلی (نه آدرس بیرونی) */
export function safeNext(next: string | null): string {
    if (!next || !next.startsWith('/') || next.startsWith('//')) return '/account';
    return next;
}
