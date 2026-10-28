import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPriceFaq } from './price-faq.ts';
import type { HistorySummary } from './price-history.ts';

const summary: HistorySummary = {
    first: 25_000_000,
    last: 26_000_000,
    change: 1_000_000,
    changePercent: 4,
    min: 24_800_000,
    max: 26_200_000,
    minDay: '2026-10-26',
    maxDay: '2026-10-28',
    average: 25_500_000,
    days: 3,
};

const ctx = { title: 'طلای ۱۸ عیار', unit: 'هر گرم', currency: 'تومان', livePrice: 26_000_000, summary, spanLabel: '۳ روز', sinceIso: '2026-10-26' };

test('پرسش‌ها پرسشی‌اند و پاسخ‌ها از داده‌ی روز ساخته می‌شوند', () => {
    const faq = buildPriceFaq(ctx);
    assert.ok(faq.length >= 4);
    for (const f of faq) {
        assert.ok(f.q.endsWith('؟'), f.q);
        assert.ok(f.a.length > 30, f.a);
    }
    assert.match(faq[0].a, /۲۶٬۰۰۰٬۰۰۰|۲۶,۰۰۰,۰۰۰/);
});

test('قیمت زنده نباشد عدد «امروز» ساخته نمی‌شود', () => {
    const faq = buildPriceFaq({ ...ctx, livePrice: undefined });
    assert.doesNotMatch(faq[0].a, /۲۶,۰۰۰,۰۰۰/);
    assert.match(faq[0].a, /زنده|به‌روز/);
});

test('پرسش فردا پیش‌بینی نمی‌کند و صادقانه می‌گوید', () => {
    const faq = buildPriceFaq(ctx);
    const tomorrow = faq.find((f) => f.q.includes('فردا'));
    assert.ok(tomorrow);
    assert.match(tomorrow.a, /پیش‌بینی/);
});

test('بدون داده‌ی کافی، پاسخ تغییر ماه ساخته‌شده ولی عدد جعلی ندارد', () => {
    const faq = buildPriceFaq({ ...ctx, summary: { ...summary, days: 0, first: 0, last: 0, min: 0, max: 0, average: 0, change: 0, changePercent: 0 } });
    const change = faq.find((f) => f.q.includes('تغییر'));
    assert.ok(change);
    assert.match(change.a, /هنوز/);
});
