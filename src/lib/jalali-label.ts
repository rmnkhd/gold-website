import { isoToJalali, jalaliDayOfWeek } from '../utils/jalali-calendar.ts';
import { toPersianDigits } from '../utils/number.ts';

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
/** از شنبه شروع می‌شود (هم‌ردیف `jalaliDayOfWeek`) */
const WEEKDAYS = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

/** `YYYY-MM-DD` میلادیِ روز به وقت تهران (نه UTC)؛ مبنای عنوان‌های تاریخ‌دار صفحه‌ها. */
export const tehranIso = (d: Date): string => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran' }).format(d);

/** «۶ آبان ۱۴۰۵» یا با `weekday` «چهارشنبه ۶ آبان ۱۴۰۵»؛ ورودی نامعتبر = رشته‌ی خالی. */
export function jalaliLabel(iso: string, opts: { weekday?: boolean } = {}): string {
    const j = isoToJalali(iso);
    if (!j) return '';
    const base = `${j.day} ${MONTHS[j.month - 1]} ${j.year}`;
    return toPersianDigits(opts.weekday ? `${WEEKDAYS[jalaliDayOfWeek(j)]} ${base}` : base);
}
