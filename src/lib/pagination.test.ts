import assert from 'node:assert/strict';
import { test } from 'node:test';

import { pageCount, pageHref, parsePage } from './pagination.ts';

test('parsePage: مقدار نامعتبر یا کمتر از ۱ به صفحه‌ی اول برمی‌گردد', () => {
    assert.equal(parsePage(undefined), 1);
    assert.equal(parsePage(''), 1);
    assert.equal(parsePage('abc'), 1);
    assert.equal(parsePage('0'), 1);
    assert.equal(parsePage('-3'), 1);
    assert.equal(parsePage('2.5'), 1);
    assert.equal(parsePage('3'), 3);
});

test('parsePage: سقف ایمنی دارد', () => {
    assert.equal(parsePage('999999'), 500);
});

test('pageCount: تعداد صفحه از total و اندازه‌ی صفحه', () => {
    assert.equal(pageCount(0, 24), 1);
    assert.equal(pageCount(24, 24), 1);
    assert.equal(pageCount(25, 24), 2);
    assert.equal(pageCount(100, 24), 5);
});

test('pageHref: صفحه‌ی اول بدون page و فیلترها حفظ می‌شود', () => {
    assert.equal(pageHref('/sellers', 1, {}), '/sellers');
    assert.equal(pageHref('/sellers', 2, {}), '/sellers?page=2');
    assert.equal(pageHref('/sellers', 3, { q: 'طلا', city: '' }), '/sellers?q=%D8%B7%D9%84%D8%A7&page=3');
});
