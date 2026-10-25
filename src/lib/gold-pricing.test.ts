import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { calcGoldPrice, pricePerGramForKarat } from './gold-pricing.ts';

describe('pricePerGramForKarat', () => {
    it('۱۸ عیار همان قیمت پایه است', () => {
        assert.equal(pricePerGramForKarat(26_000_000, 18), 26_000_000);
    });

    it('۲۴ عیار متناسب با خلوص گران‌تر است', () => {
        assert.equal(pricePerGramForKarat(27_000_000, 24), 36_000_000);
    });

    it('۲۱ عیار', () => {
        assert.equal(pricePerGramForKarat(24_000_000, 21), 28_000_000);
    });
});

describe('calcGoldPrice', () => {
    const base = {
        weightGram: 10,
        karat: 18,
        pricePerGram18: 26_000_000,
        wagePercent: 10,
        profitPercent: 7,
    } as const;

    it('مالیات فقط روی اجرت و سود است، نه روی خودِ طلا', () => {
        const r = calcGoldPrice(base);
        assert.equal(r.goldValue, 260_000_000);
        assert.equal(r.wage, 26_000_000);
        // سود ۷٪ از (طلا + اجرت)
        assert.equal(r.profit, 20_020_000);
        // مالیات ۹٪ از (اجرت + سود)
        assert.equal(r.vat, 4_141_800);
        assert.equal(r.total, 260_000_000 + 26_000_000 + 20_020_000 + 4_141_800);
    });

    it('بدون اجرت و سود، مالیات صفر است (طلای آب‌شده / شمش)', () => {
        const r = calcGoldPrice({ ...base, wagePercent: 0, profitPercent: 0 });
        assert.equal(r.vat, 0);
        assert.equal(r.total, r.goldValue);
    });

    it('وزن صفر یا منفی خطا می‌دهد', () => {
        assert.throws(() => calcGoldPrice({ ...base, weightGram: 0 }));
        assert.throws(() => calcGoldPrice({ ...base, weightGram: -1 }));
    });

    it('اعداد گرد می‌شوند (تومان صحیح)', () => {
        const r = calcGoldPrice({ ...base, weightGram: 3.333 });
        assert.ok(Number.isInteger(r.total));
    });
});
