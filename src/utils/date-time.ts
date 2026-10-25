/**
 * تنها دروازه‌ی تاریخ در پنل.
 *
 * دو کار می‌کند:
 * ۱. پچ تقویم شمسی را روی `pasoonate` نصب می‌کند (در زمان لود ماژول)
 * ۲. همه‌ی قالب‌بندی‌های تاریخ را با ارقام فارسی بیرون می‌دهد
 *
 * هیچ کامپوننتی نباید مستقیم `pasoonate` را ایمپورت کند — با این کار پچ دور
 * زده می‌شود و تاریخ‌های بعد از ۱۴۰۹ غلط درمی‌آیند.
 */

// Services
import Pasoonate from 'pasoonate';

// Utils And Hooks
import {
    addJalaliDays,
    installJalaliPatch,
    jalaliDayOfWeek,
    jalaliDaysInMonth,
    toJalali,
    type JalaliDate,
} from '@/utils/jalali-calendar';
import { toPersianDigits } from '@/utils/number';

/**
 * پروتوتایپ تقویم شمسی فقط از راه یک نمونه‌ی `CalendarManager` در دسترس است؛
 * کتابخانه کلاس را export نمی‌کند.
 */
const jalaliCalendar = (Pasoonate.make() as unknown as { _jalali: object })._jalali;
installJalaliPatch(Object.getPrototypeOf(jalaliCalendar) as object);

export const JALALI_MONTHS = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
] as const;

/** از شنبه شروع می‌شود — همان ترتیبی که گرید تقویم می‌خواهد */
export const WEEKDAYS = [
    'شنبه',
    'یک‌شنبه',
    'دوشنبه',
    'سه‌شنبه',
    'چهارشنبه',
    'پنج‌شنبه',
    'جمعه',
] as const;

export const WEEKDAYS_SHORT = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'] as const;

const pad = (value: number): string => String(value).padStart(2, '0');

const asDate = (input: Date | string | number): Date =>
    input instanceof Date ? input : new Date(input);

export const todayJalali = (): JalaliDate => toJalali(new Date());

/** ۱۴۰۴/۰۶/۱۱ */
export function formatJalali(input: Date | string | number): string {
    const { year, month, day } = toJalali(asDate(input));
    return toPersianDigits(`${year}/${pad(month)}/${pad(day)}`);
}

/** ۱۱ شهریور ۱۴۰۴ */
export function formatJalaliLong(input: Date | string | number): string {
    const { year, month, day } = toJalali(asDate(input));
    return toPersianDigits(`${day} ${JALALI_MONTHS[month - 1]} ${year}`);
}

/** شنبه ۱۱ شهریور */
export function formatJalaliWithWeekday(input: Date | string | number): string {
    const jalali = toJalali(asDate(input));
    const weekday = WEEKDAYS[jalaliDayOfWeek(jalali)];
    return toPersianDigits(`${weekday} ${jalali.day} ${JALALI_MONTHS[jalali.month - 1]}`);
}

/** ۱۴:۳۰ */
export function formatTime(input: Date | string | number): string {
    const date = asDate(input);
    return toPersianDigits(`${pad(date.getHours())}:${pad(date.getMinutes())}`);
}

/** ۱۱ شهریور ۱۴۰۴ · ۱۴:۳۰ */
export function formatJalaliDateTime(input: Date | string | number): string {
    return `${formatJalaliLong(input)} · ${formatTime(input)}`;
}

/** شهریور ۱۴۰۴ */
export function formatJalaliMonth({ year, month }: JalaliDate): string {
    return toPersianDigits(`${JALALI_MONTHS[month - 1]} ${year}`);
}

/**
 * «۳ ساعت پیش» / «۲ روز دیگر».
 * عمداً هیچ خروجی‌ای با علامت ریاضی شروع نمی‌شود — در RTL جابه‌جا رندر می‌شود.
 */
export function formatRelative(input: Date | string | number): string {
    const diffSeconds = Math.round((asDate(input).getTime() - Date.now()) / 1000);
    const past = diffSeconds < 0;
    const seconds = Math.abs(diffSeconds);

    const units: Array<{ limit: number; size: number; label: string }> = [
        { limit: 60, size: 1, label: 'ثانیه' },
        { limit: 3600, size: 60, label: 'دقیقه' },
        { limit: 86400, size: 3600, label: 'ساعت' },
        { limit: 2592000, size: 86400, label: 'روز' },
        { limit: 31536000, size: 2592000, label: 'ماه' },
        { limit: Number.POSITIVE_INFINITY, size: 31536000, label: 'سال' },
    ];

    if (seconds < 45) return past ? 'همین حالا' : 'تا لحظاتی دیگر';

    const unit = units.find((candidate) => seconds < candidate.limit) ?? units[units.length - 1];
    const value = Math.max(1, Math.round(seconds / unit.size));

    return `${toPersianDigits(value)} ${unit.label} ${past ? 'پیش' : 'دیگر'}`;
}

export interface CalendarCell {
    date: JalaliDate;
    /** خانه‌های ماه قبل و بعد که فقط برای پرکردن گرید هستند */
    isOutside: boolean;
    isToday: boolean;
}

/**
 * گرید ۶×۷ یک ماه شمسی، از شنبه.
 * همیشه ۴۲ خانه برمی‌گرداند تا ارتفاع تقویم با تغییر ماه نپرد.
 */
export function buildMonthGrid(month: JalaliDate): CalendarCell[] {
    const first: JalaliDate = { year: month.year, month: month.month, day: 1 };
    const leadingDays = jalaliDayOfWeek(first);
    const today = todayJalali();
    const totalDays = jalaliDaysInMonth(month.year, month.month);

    return Array.from({ length: 42 }, (_, index) => {
        const offset = index - leadingDays;
        const date = addJalaliDays(first, offset);

        return {
            date,
            isOutside: offset < 0 || offset >= totalDays,
            isToday:
                date.year === today.year && date.month === today.month && date.day === today.day,
        };
    });
}

/** ماه بعد/قبل، بدون سرریز شدن شماره‌ی ماه */
export function shiftJalaliMonth({ year, month }: JalaliDate, delta: number): JalaliDate {
    const total = year * 12 + (month - 1) + delta;
    return { year: Math.floor(total / 12), month: (total % 12) + 1, day: 1 };
}
