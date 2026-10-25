/**
 * نرمال‌سازی و اعتبارسنجیِ شماره‌ی موبایل ایران.
 *
 * از `app/login/login-schema.ts` بیرون کشیده شد چون ویزارد راه‌اندازی هم
 * همین را لازم دارد: فیلد `phone` پروفایل با همان قاعده‌ی `/auth` سنجیده
 * می‌شود (`internal/validate` سمتِ گو). نسخه‌ی دومِ همین منطق یعنی جایی
 * که می‌تواند بی‌صدا از اصل دور بیفتد.
 *
 * عمداً بدون ایمپورت `@/*` نوشته شده تا با رانر داخلیِ نود قابل تست باشد
 * → `amlaki-vault/decisions/TDD اجباری.md`
 */

/** موبایل ایران، بعد از نرمال‌سازی ارقام */
const IRAN_MOBILE = /^09\d{9}$/;

/**
 * ارقام فارسی و عربی را به لاتین می‌برد.
 *
 * کاربر ایرانی روی کیبورد فارسی رقم فارسی می‌زند؛ رد کردن ورودی‌اش یعنی
 * گفتن «شماره‌ات اشتباه است» به کسی که درست وارد کرده. بک‌اند هم همین
 * ارفاق را دارد.
 */
export function normalizeDigits(value: string): string {
    return value.replace(/[۰-۹٠-٩]/g, (digit) => {
        const persian = '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit);
        if (persian >= 0) return String(persian);
        return String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit));
    });
}

/** شکل‌های رایج نوشتن یک شماره را به `09xxxxxxxxx` می‌رساند */
export function normalizeMobile(value: string): string {
    let digits = normalizeDigits(value).replace(/[\s\p{Cf}\-().]/gu, '');

    if (digits.startsWith('+98')) digits = `0${digits.slice(3)}`;
    else if (digits.startsWith('0098')) digits = `0${digits.slice(4)}`;
    else if (digits.startsWith('98') && digits.length === 12) digits = `0${digits.slice(2)}`;
    else if (digits.startsWith('9') && digits.length === 10) digits = `0${digits}`;

    return digits;
}

/**
 * موبایل را به `09xxxxxxxxx` می‌برد؛ اگر معتبر نباشد `null`.
 * همان قاعده‌ی `validate.IranMobile` سمتِ گو.
 */
export function toIranMobile(value: string): string | null {
    const normalized = normalizeMobile(value);
    return IRAN_MOBILE.test(normalized) ? normalized : null;
}

/** آیا این رشته بعد از نرمال‌سازی یک موبایل ایرانیِ معتبر است */
export function isValidMobile(value: string): boolean {
    return IRAN_MOBILE.test(normalizeMobile(value.trim()));
}

/** پیوند شماره‌گیر فقط برای موبایل معتبر ساخته می‌شود. */
export function callMobileHref(value: string): string | null {
    return isValidMobile(value) ? `tel:${normalizeMobile(value.trim())}` : null;
}
