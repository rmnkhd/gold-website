import assert from 'node:assert/strict';
import test from 'node:test';

import { sellerRedirectPath } from './seller-path.ts';

test('sellerRedirectPath: slug قدیمی به نشانی فعلی ریدایرکت می‌شود، slug فعلی نه', () => {
    assert.equal(sellerRedirectPath('old-name', 'new-name'), '/sellers/new-name');
    assert.equal(sellerRedirectPath('same', 'same'), null);
    // slug در URL ممکن است درصدگذاری‌شده بیاید؛ همان فعلی حساب می‌شود
    assert.equal(sellerRedirectPath('shop-%61bc', 'shop-abc'), null);
});
