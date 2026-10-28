import assert from 'node:assert/strict';
import test from 'node:test';

import { jalaliLabel, tehranIso } from './jalali-label.ts';

test('jalaliLabel: روز، ماه و سال شمسی با ارقام فارسی', () => {
    assert.equal(jalaliLabel('2026-10-28'), '۶ آبان ۱۴۰۵');
    assert.equal(jalaliLabel('2026-03-21'), '۱ فروردین ۱۴۰۵');
});

test('jalaliLabel: روز هفته (۲۰۲۶-۱۰-۲۸ چهارشنبه است)', () => {
    assert.equal(jalaliLabel('2026-10-28', { weekday: true }), 'چهارشنبه ۶ آبان ۱۴۰۵');
});

test('jalaliLabel: ورودی نامعتبر خالی برمی‌گرداند نه خطا', () => {
    assert.equal(jalaliLabel('نامعتبر'), '');
    assert.equal(jalaliLabel('2026-13-45'), '');
});

test('tehranIso: مرز روز به وقت تهران است نه UTC', () => {
    // ۲۰:۳۰ UTC = ۰۰:۰۰ تهران روز بعد
    assert.equal(tehranIso(new Date('2026-10-28T20:30:00Z')), '2026-10-29');
    assert.equal(tehranIso(new Date('2026-10-28T20:29:00Z')), '2026-10-28');
});
