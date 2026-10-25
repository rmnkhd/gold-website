/**
 * تست تقویم شمسی.
 *
 * اجرا: `yarn test`
 * (رانرِ داخلی نود + type-stripping — هیچ پکیجی اضافه نشده)
 *
 * تست اول روی حسابِ خودِ `pasoonate` رد می‌شود؛ همان چیزی که وجود
 * `jalali-calendar.ts` را توجیه می‌کند.
 */

// React
import test from 'node:test';
import assert from 'node:assert/strict';

// Utils And Hooks
import {
    addJalaliDays,
    diffJalaliDays,
    fromJalali,
    isJalaliLeapYear,
    jalaliDayOfWeek,
    isoToJalali,
    jalaliDaysInMonth,
    jalaliToIso,
    toJalali,
} from './jalali-calendar.ts';

test('نوروز ۱۴۰۹ درست تبدیل می‌شود — همان تاریخی که pasoonate ماه ۱۳ می‌دهد', () => {
    assert.deepEqual(toJalali(new Date(2030, 2, 21)), { year: 1409, month: 1, day: 1 });
    // ۱۴۰۸ کبیسه است، پس روز آخرش ۳۰ اسفند است نه ۲۹
    assert.deepEqual(toJalali(new Date(2030, 2, 20)), { year: 1408, month: 12, day: 30 });
});

test('نوروزهای شناخته‌شده', () => {
    assert.deepEqual(toJalali(new Date(2024, 2, 20)), { year: 1403, month: 1, day: 1 });
    assert.deepEqual(toJalali(new Date(2025, 2, 21)), { year: 1404, month: 1, day: 1 });
    assert.deepEqual(toJalali(new Date(2026, 2, 21)), { year: 1405, month: 1, day: 1 });
});

test('هیچ ماهی بیرون از بازه‌ی ۱..۱۲ ساخته نمی‌شود', () => {
    for (let i = 0; i < 40000; i += 1) {
        const date = new Date(2000, 0, 1 + i);
        const jalali = toJalali(date);
        assert.ok(jalali.month >= 1 && jalali.month <= 12, `ماه نامعتبر: ${jalali.month}`);
        assert.ok(
            jalali.day >= 1 && jalali.day <= jalaliDaysInMonth(jalali.year, jalali.month),
            `روز نامعتبر: ${jalali.year}/${jalali.month}/${jalali.day}`
        );
    }
});

test('رفت‌وبرگشت شمسی↔میلادی روی ۴۰ هزار روز پایدار است', () => {
    for (let i = 0; i < 40000; i += 1) {
        const date = new Date(2000, 0, 1 + i);
        const back = fromJalali(toJalali(date));
        assert.equal(back.getFullYear(), date.getFullYear());
        assert.equal(back.getMonth(), date.getMonth());
        assert.equal(back.getDate(), date.getDate());
    }
});

test('اسفند در سال کبیسه ۳۰ روز است', () => {
    assert.equal(isJalaliLeapYear(1403), true);
    assert.equal(jalaliDaysInMonth(1403, 12), 30);
    assert.equal(isJalaliLeapYear(1404), false);
    assert.equal(jalaliDaysInMonth(1404, 12), 29);
    assert.equal(jalaliDaysInMonth(1404, 6), 31);
    assert.equal(jalaliDaysInMonth(1404, 7), 30);
});

test('۰ یعنی شنبه', () => {
    // ۱ فروردین ۱۴۰۴ برابر ۲۰۲۵-۰۳-۲۱ است که جمعه بود
    assert.equal(jalaliDayOfWeek({ year: 1404, month: 1, day: 1 }), 6);
    assert.equal(jalaliDayOfWeek({ year: 1404, month: 1, day: 2 }), 0);
});

test('جمع و تفریق روز از مرز ماه و سال رد می‌شود', () => {
    assert.deepEqual(addJalaliDays({ year: 1404, month: 12, day: 29 }, 1), {
        year: 1405,
        month: 1,
        day: 1,
    });
    assert.deepEqual(addJalaliDays({ year: 1404, month: 6, day: 31 }, 1), {
        year: 1404,
        month: 7,
        day: 1,
    });
    assert.equal(
        diffJalaliDays({ year: 1405, month: 1, day: 1 }, { year: 1404, month: 1, day: 1 }),
        365
    );
});

test('isoToJalali و jalaliToIso دو‌طرفه و مستقل از منطقه‌ی زمانی‌اند', () => {
    // ۲۵ اکتبر ۲۰۲۶ = ۳ آبان ۱۴۰۵
    assert.deepEqual(isoToJalali('2026-10-25'), { year: 1405, month: 8, day: 3 });
    assert.equal(jalaliToIso({ year: 1405, month: 8, day: 3 }), '2026-10-25');
    // نوروز ۱۴۰۵ = ۲۰ مارس ۲۰۲۶
    assert.equal(jalaliToIso({ year: 1405, month: 1, day: 1 }), '2026-03-21');
    // پایان سال کبیسه‌ی ۱۴۰۳ (۳۰ اسفند)
    assert.equal(jalaliToIso({ year: 1403, month: 12, day: 30 }), '2025-03-20');
    // رفت‌وبرگشت روی یک سال کامل
    for (let d = 0; d < 366; d += 1) {
        const date = addJalaliDays({ year: 1403, month: 1, day: 1 }, d);
        assert.deepEqual(isoToJalali(jalaliToIso(date)), date);
    }
});

test('isoToJalali مقدار نامعتبر یا خالی را undefined می‌دهد', () => {
    assert.equal(isoToJalali(''), undefined);
    assert.equal(isoToJalali('abc'), undefined);
    assert.equal(isoToJalali('2026-13-45'), undefined);
});
