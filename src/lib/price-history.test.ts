import assert from 'node:assert/strict';
import test from 'node:test';

import { buildChart, changeSentence, compactPrice, parseRange, type HistoryPoint, type HistorySummary } from './price-history.ts';

const pt = (day: string, close: number, low = close, high = close): HistoryPoint => ({
    day,
    open: close,
    high,
    low,
    close,
    samples: 5,
});

test('parseRange: پیش‌فرض ۳۰ روز و مقدار ناشناخته نادیده گرفته می‌شود', () => {
    assert.equal(parseRange(undefined), '30d');
    assert.equal(parseRange('7d'), '7d');
    assert.equal(parseRange('1y'), '1y');
    assert.equal(parseRange('all'), 'all');
    assert.equal(parseRange('999d'), '30d');
    assert.equal(parseRange(['90d', '7d']), '90d');
});

test('buildChart: کمتر از دو نقطه نمودار ندارد', () => {
    assert.equal(buildChart([], { width: 600, height: 240 }), null);
    assert.equal(buildChart([pt('2026-10-01', 100)], { width: 600, height: 240 }), null);
});

test('buildChart: نقطه‌ها داخل کادر و x صعودی؛ بیشینه بالاترین نقطه است', () => {
    const g = buildChart([pt('2026-10-01', 100), pt('2026-10-02', 140), pt('2026-10-03', 120)], { width: 600, height: 240, padding: 20 });
    assert.ok(g);
    const xs = g.points.map((p) => p.x);
    assert.deepEqual([...xs].sort((a, b) => a - b), xs);
    for (const p of g.points) {
        assert.ok(p.x >= 20 && p.x <= 580, `x ${p.x}`);
        assert.ok(p.y >= 20 && p.y <= 220, `y ${p.y}`);
    }
    const top = g.points.reduce((a, b) => (a.y < b.y ? a : b));
    assert.equal(top.close, 140);
    assert.ok(g.line.startsWith('M'));
    assert.ok(g.area.endsWith('Z'));
});

test('buildChart: سری ثابت تقسیم بر صفر نمی‌سازد', () => {
    const g = buildChart([pt('2026-10-01', 100), pt('2026-10-02', 100), pt('2026-10-03', 100)], { width: 600, height: 240 });
    assert.ok(g);
    for (const p of g.points) assert.ok(Number.isFinite(p.y));
    assert.ok(!g.line.includes('NaN'));
});

test('changeSentence: جهت و درصد با ارقام فارسی', () => {
    const base: HistorySummary = { first: 100, last: 110, change: 10, changePercent: 10, min: 95, max: 112, minDay: '2026-10-01', maxDay: '2026-10-05', average: 104, days: 5 };
    assert.match(changeSentence(base, '۵ روز'), /افزایش/);
    assert.match(changeSentence(base, '۵ روز'), /۱۰٪/);
    assert.match(changeSentence({ ...base, change: -4, changePercent: -3.6 }, '۵ روز'), /کاهش/);
    assert.match(changeSentence({ ...base, change: 0, changePercent: 0 }, '۵ روز'), /بدون تغییر/);
    assert.match(changeSentence({ ...base, days: 1 }, '۵ روز'), /داده‌ی کافی/);
});

test('compactPrice: میلیون برای مبلغ‌های بزرگ، عدد کامل برای کوچک', () => {
    assert.equal(compactPrice(26_291_611), '۲۶٫۲۹ م');
    assert.equal(compactPrice(267_000_000), '۲۶۷ م');
    assert.equal(compactPrice(4_012), '۴٬۰۱۲');
});
