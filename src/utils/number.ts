const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** ارقام لاتین را به فارسی تبدیل می‌کند — برای نمایش، نه برای مقدار */
export const toPersianDigits = (value: string | number): string =>
    String(value ?? '').replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);

/** جداکننده‌ی هزارگان + ارقام فارسی */
export const formatPrice = (value: number): string =>
    toPersianDigits(new Intl.NumberFormat('en-US').format(value ?? 0));
