import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { findCity, normalizeFa, searchCities } from './city-search.ts';

describe('normalizeFa', () => {
    it('ی/ک عربی، نیم‌فاصله و فاصله را یکسان می‌کند', () => {
        assert.equal(normalizeFa('كرمانشاه'), 'کرمانشاه');
        assert.equal(normalizeFa('شهر کرد'), normalizeFa('شهرکرد'));
        assert.equal(normalizeFa('خرم‌آباد'), normalizeFa('خرم آباد'));
        assert.equal(normalizeFa('آ'), normalizeFa('ا'));
    });
});

describe('searchCities', () => {
    it('پیشوند نام شهر در صدر می‌آید', () => {
        const result = searchCities('تهر');
        assert.equal(result[0]?.name, 'تهران');
    });

    it('جست‌وجوی میان‌واژه و نام استان کار می‌کند', () => {
        assert.ok(searchCities('شیراز').some((c) => c.name === 'شیراز'));
        assert.ok(searchCities('خراسان رضوی').some((c) => c.name === 'مشهد'));
    });

    it('عبارت خالی همه‌ی شهرها را می‌دهد و نتیجه‌ی نامربوط خالی است', () => {
        assert.ok(searchCities('').length > 100);
        assert.deepEqual(searchCities('qqqzzz'), []);
    });
});

describe('findCity', () => {
    it('نام دقیق (با املای عربی) را پیدا می‌کند', () => {
        assert.equal(findCity('اصفهان')?.province, 'اصفهان');
        assert.equal(findCity('كرج')?.name, 'کرج');
    });

    it('مقدار قدیمیِ خارج از فهرست خطا نمی‌دهد', () => {
        assert.equal(findCity('شهرِ ناشناخته'), undefined);
        assert.equal(findCity(''), undefined);
    });
});

describe('فهرست شهرها', () => {
    it('مرکز هر ۳۱ استان و مختصات معتبر دارد', async () => {
        const { IRAN_CITIES } = await import('../statics/iran-cities.ts');
        const provinces = new Set(IRAN_CITIES.map((c) => c.province));
        assert.equal(provinces.size, 31);
        for (const c of IRAN_CITIES) {
            assert.ok(c.lat > 24 && c.lat < 40, c.name);
            assert.ok(c.lng > 44 && c.lng < 64, c.name);
        }
        const names = IRAN_CITIES.map((c) => c.name);
        assert.equal(new Set(names).size, names.length, 'نام تکراری');
    });
});
