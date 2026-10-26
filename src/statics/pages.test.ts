import assert from 'node:assert/strict';
import { test } from 'node:test';

import { getInfoPage, INFO_PAGES } from './pages.ts';

test('صفحه‌های اطلاعاتی: about و terms و privacy یکتا و پرمحتوا هستند', () => {
    assert.deepEqual(INFO_PAGES.map((p) => p.slug).sort(), ['about', 'privacy', 'terms']);
    for (const page of INFO_PAGES) {
        assert.ok(page.title.length > 3);
        assert.ok(page.description.length >= 50 && page.description.length <= 200, `${page.slug} description`);
        assert.match(page.updatedIso, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(page.sections.length >= 3);
        for (const s of page.sections) assert.ok(s.paragraphs.every((p) => p.trim().length > 0));
    }
});

test('مقررات و درباره: «پلتفرم ارتباطی» و نگهداری نکردن وجه صریحاً آمده است', () => {
    for (const slug of ['about', 'terms'] as const) {
        const text = getInfoPage(slug).sections.flatMap((s) => s.paragraphs).join(' ');
        assert.match(text, /هیچ (پولی|وجهی)/, slug);
    }
});
