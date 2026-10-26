import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ageLabel, describePrice, priceStatusDetail, STALE_AFTER_SECONDS } from './price-status.ts';

const live = { source: 'live:navasan', stale: false, ageSeconds: 4 };

it('distinguishes an enabled but rejected feed from an unconfigured feed', () => {
    for (const feedState of ['pending', 'rejected', 'verified', 'disabled'] as const) {
        const s = describePrice({ source: 'seed', stale: true, ageSeconds: 900, feedState }, { elapsedSeconds: 0, failed: false });
        assert.equal(s.state, 'sample');
        assert.equal(s.feedState, feedState);
        const detail = priceStatusDetail(s);
        assert.ok(!detail.includes('تا اتصال'));
        if (feedState === 'rejected') assert.equal(detail, 'دادهٔ منابع تأیید نشد');
        if (feedState === 'disabled') assert.equal(detail, 'فید زنده غیرفعال است');
    }
    assert.equal(priceStatusDetail({ state: 'sample', ageSeconds: 0 }), 'قیمت زنده هنوز تأیید نشده');
    assert.equal(priceStatusDetail({ state: 'stale', ageSeconds: 600, feedState: 'rejected' }), 'دادهٔ منابع تأیید نشد · آخرین به‌روزرسانی ۱۰ دقیقه پیش');
});

describe('describePrice', () => {
    it('قرائت زنده و تازه = live', () => {
        const s = describePrice(live, { elapsedSeconds: 3, failed: false });
        assert.equal(s.state, 'live');
        assert.equal(s.ageSeconds, 7);
    });

    it('قیمت seed/manual هرگز زنده نیست', () => {
        for (const source of ['seed', 'manual', 'simulated', 'live', 'livex']) {
            const s = describePrice(
                { source, stale: false, ageSeconds: 1 },
                { elapsedSeconds: 0, failed: false }
            );
            assert.equal(s.state, 'sample', source);
        }
    });

    it('کهنه‌ی سمت سرور یا بر اثر گذشت زمان محلی = stale', () => {
        assert.equal(
            describePrice({ ...live, stale: true }, { elapsedSeconds: 0, failed: false }).state,
            'stale'
        );
        const s = describePrice(
            { ...live, ageSeconds: STALE_AFTER_SECONDS - 5 },
            { elapsedSeconds: 10, failed: false }
        );
        assert.equal(s.state, 'stale');
    });

    it('شکست شبکه با داده‌ی قبلی = offline (حتی اگر زنده بوده)', () => {
        assert.equal(describePrice(live, { elapsedSeconds: 1, failed: true }).state, 'offline');
    });

    it('قیمت نمونه‌ی آفلاین همچنان نمونه است نه زنده', () => {
        const s = describePrice(
            { source: 'seed', stale: true, ageSeconds: 9999 },
            { elapsedSeconds: 0, failed: false }
        );
        assert.equal(s.state, 'sample');
    });
});

describe('ageLabel', () => {
    it('واحد مناسب و ارقام فارسی', () => {
        assert.equal(ageLabel(0), 'همین الان');
        assert.equal(ageLabel(4), '۴ ثانیه پیش');
        assert.equal(ageLabel(59), '۵۹ ثانیه پیش');
        assert.equal(ageLabel(125), '۲ دقیقه پیش');
        assert.equal(ageLabel(3 * 3600 + 5), '۳ ساعت پیش');
        assert.equal(ageLabel(2 * 86400), '۲ روز پیش');
    });
});

it('keeps upstream attribution with stale cached prices', () => {
    const s = describePrice({ source: 'live:talasanj+nerkhsanj', stale: true, ageSeconds: 400 }, { elapsedSeconds: 0, failed: false });
    assert.equal(s.source, 'live:talasanj+nerkhsanj');
});
