/**
 * تبدیل تقویم شمسی — حساب درست، جدا از هر کتابخانه.
 *
 * چرا این فایل وجود دارد:
 * `pasoonate` تبدیل شمسی را با طول «سال گرمسیری» (۳۶۵٫۲۴۲۱۹۸۷۸ روز) حساب
 * می‌کند و همین باعث رانش تدریجی می‌شود. با تقویم واقعی ایران که قاعده‌ی
 * ۳۳ساله دارد جور در نمی‌آید و از نوروز ۱۴۰۹ (۲۰۳۰-۰۳-۲۱) به بعد
 * `getMonth()` مقدار ۱۳ برمی‌گرداند و یک سال کامل عقب می‌ماند —
 * ۳۶۶ روز پشت‌سرهم غلط. (اندازه‌گیری شده، نه حدس.)
 *
 * پس حساب درست اینجا نوشته می‌شود (الگوریتم شکست‌های ۳۳ساله) و
 * `installJalaliPatch` همان حساب را روی پروتوتایپ pasoonate هم می‌نشاند تا اگر
 * جایی مستقیم از خود کتابخانه استفاده شد، باز هم درست باشد.
 *
 * هر جا مستقیم `pasoonate` ایمپورت شود بدون اینکه `utils/date-time` لود شده
 * باشد، پچ دور زده می‌شود.
 */

export interface JalaliDate {
    year: number;
    month: number;
    day: number;
}

/** روزشمار جولیَنِ ۱۹۷۰-۰۱-۰۱ — مبدأ مشترک همه‌ی تبدیل‌ها */
export const JDN_UNIX_EPOCH = 2440588;

const div = (a: number, b: number): number => Math.trunc(a / b);
const mod = (a: number, b: number): number => a - b * Math.floor(a / b);

/**
 * سال‌هایی که چرخه‌ی ۳۳ساله در آن‌ها می‌شکند. این عددها رصدی‌اند نه فرمولی،
 * برای همین باید جدول باشند و محاسبه نشوند.
 */
const BREAKS = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
    2456, 3178,
];

interface JalaliYearInfo {
    /** فاصله تا کبیسه‌ی بعدی؛ ۰ یعنی خودِ این سال کبیسه است */
    leap: number;
    /** سال میلادیِ متناظر با فروردینِ این سال */
    gy: number;
    /** روزِ ماه مارس که ۱ فروردین روی آن می‌افتد */
    march: number;
}

function jalaliYearInfo(jy: number): JalaliYearInfo {
    const gy = jy + 621;
    let leapJ = -14;
    let jp = BREAKS[0];
    let jump = 0;

    for (let i = 1; i < BREAKS.length; i += 1) {
        const jm = BREAKS[i];
        jump = jm - jp;
        if (jy < jm) break;
        leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
        jp = jm;
    }

    let n = jy - jp;
    leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
    if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

    const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
    const march = 20 + leapJ - leapG;

    if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
    let leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) leap = 4;

    return { leap, gy, march };
}

/** روزشمار جولیَن از تاریخ میلادی */
export function gregorianToJdn(gy: number, gm: number, gd: number): number {
    let d =
        div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
        div(153 * mod(gm + 9, 12) + 2, 5) +
        gd -
        34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
}

/** تاریخ میلادی از روزشمار جولیَن */
export function jdnToGregorian(jdn: number): { gy: number; gm: number; gd: number } {
    let j = 4 * jdn + 139361631;
    j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    const i = div(mod(j, 1461), 4) * 5 + 308;
    const gd = div(mod(i, 153), 5) + 1;
    const gm = mod(div(i, 153), 12) + 1;
    const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
    return { gy, gm, gd };
}

/** روزشمار جولیَن از تاریخ شمسی */
export function jalaliToJdn(jy: number, jm: number, jd: number): number {
    const r = jalaliYearInfo(jy);
    return gregorianToJdn(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

/** تاریخ شمسی از روزشمار جولیَن */
export function jdnToJalali(jdn: number): JalaliDate {
    const gy = jdnToGregorian(jdn).gy;
    let jy = gy - 621;
    const r = jalaliYearInfo(jy);
    let k = jdn - gregorianToJdn(gy, 3, r.march);

    if (k >= 0) {
        if (k <= 185) {
            return { year: jy, month: 1 + div(k, 31), day: mod(k, 31) + 1 };
        }
        k -= 186;
    } else {
        jy -= 1;
        k += 179;
        if (r.leap === 1) k += 1;
    }

    return { year: jy, month: 7 + div(k, 30), day: mod(k, 30) + 1 };
}

/** آیا سال شمسی کبیسه است */
export function isJalaliLeapYear(jy: number): boolean {
    return jalaliYearInfo(jy).leap === 0;
}

/** تعداد روزهای ماه شمسی — اسفندِ سال کبیسه ۳۰ روز است */
export function jalaliDaysInMonth(jy: number, jm: number): number {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    return isJalaliLeapYear(jy) ? 30 : 29;
}

/**
 * میلادیِ محلی → شمسی.
 * عمداً از اجزای محلی (`getFullYear`…) استفاده می‌شود نه UTC، چون «امروز» باید
 * امروزِ کاربر باشد نه امروزِ گرینویچ.
 */
export function toJalali(date: Date): JalaliDate {
    return jdnToJalali(gregorianToJdn(date.getFullYear(), date.getMonth() + 1, date.getDate()));
}

/** شمسی → میلادیِ محلی، ساعت ۰۰:۰۰ */
export function fromJalali({ year, month, day }: JalaliDate): Date {
    const { gy, gm, gd } = jdnToGregorian(jalaliToJdn(year, month, day));
    return new Date(gy, gm - 1, gd);
}

/**
 * `YYYY-MM-DD` میلادی (مثل خروجی input[type=date]) → تاریخ شمسی.
 * خالی، بدشکل یا روزِ ناموجود (مثل ۲۰۲۶-۱۳-۴۵) = undefined.
 */
export function isoToJalali(iso: string): JalaliDate | undefined {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return undefined;
    const [gy, gm, gd] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const probe = new Date(Date.UTC(gy, gm - 1, gd));
    if (probe.getUTCFullYear() !== gy || probe.getUTCMonth() !== gm - 1 || probe.getUTCDate() !== gd) {
        return undefined;
    }
    return jdnToJalali(gregorianToJdn(gy, gm, gd));
}

/** تاریخ شمسی → `YYYY-MM-DD` میلادی؛ بدون `Date` پس مستقل از منطقه‌ی زمانی */
export function jalaliToIso({ year, month, day }: JalaliDate): string {
    const { gy, gm, gd } = jdnToGregorian(jalaliToJdn(year, month, day));
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${gy}-${pad(gm)}-${pad(gd)}`;
}

/** ۰ = شنبه … ۶ = جمعه */
export function jalaliDayOfWeek(date: JalaliDate): number {
    return mod(jalaliToJdn(date.year, date.month, date.day) + 2, 7);
}

/** جابه‌جایی روزشمار روی تاریخ شمسی، بدون رفت‌وبرگشت به `Date` */
export function addJalaliDays(date: JalaliDate, days: number): JalaliDate {
    return jdnToJalali(jalaliToJdn(date.year, date.month, date.day) + days);
}

/** فاصله‌ی روزیِ دو تاریخ شمسی (a منهای b) */
export function diffJalaliDays(a: JalaliDate, b: JalaliDate): number {
    return jalaliToJdn(a.year, a.month, a.day) - jalaliToJdn(b.year, b.month, b.day);
}

export const isSameJalaliDay = (a: JalaliDate, b: JalaliDate): boolean =>
    a.year === b.year && a.month === b.month && a.day === b.day;

/* ------------------------------------------------------------------ *
 * پچ pasoonate
 * ------------------------------------------------------------------ */

interface JalaliCalendarPrototype {
    dateToJulianDay(
        year: number,
        month: number,
        day: number,
        hour: number,
        minute: number,
        second: number
    ): number;
    julianDayToDate(julianDay: number): {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
    daysInMonth(year: number, month: number): number;
    isLeap(year: number): boolean;
}

const J1970 = 2440587.5;
const DAY_SECONDS = 86400;

let patched = false;

/**
 * حساب درست را روی پروتوتایپِ تقویم شمسیِ pasoonate می‌نشاند.
 * یک بار در `utils/date-time.ts` صدا زده می‌شود؛ فراخوانی دوباره بی‌اثر است.
 */
export function installJalaliPatch(jalaliCalendarPrototype: object): void {
    if (patched) return;
    patched = true;

    const proto = jalaliCalendarPrototype as JalaliCalendarPrototype;

    proto.dateToJulianDay = function dateToJulianDay(year, month, day, hour, minute, second) {
        const jdn = jalaliToJdn(year, month, day);
        const timestamp = (jdn - JDN_UNIX_EPOCH) * DAY_SECONDS + hour * 3600 + minute * 60 + second;
        return timestamp / DAY_SECONDS + J1970;
    };

    proto.julianDayToDate = function julianDayToDate(julianDay) {
        // از راه timestamp می‌رویم تا خطای ممیز شناور در کسرِ روز، مرزِ نیمه‌شب
        // را یک روز جابه‌جا نکند.
        const timestamp = Math.round((julianDay - J1970) * DAY_SECONDS);
        const jdn = Math.floor(timestamp / DAY_SECONDS) + JDN_UNIX_EPOCH;
        const secondsOfDay = mod(timestamp, DAY_SECONDS);
        const { year, month, day } = jdnToJalali(jdn);

        return {
            year,
            month,
            day,
            hour: Math.floor(secondsOfDay / 3600),
            minute: Math.floor((secondsOfDay % 3600) / 60),
            second: secondsOfDay % 60,
        };
    };

    proto.daysInMonth = jalaliDaysInMonth;
    proto.isLeap = isJalaliLeapYear;
}
