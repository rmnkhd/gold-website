import assert from 'node:assert/strict';
import test from 'node:test';

import { GLOSSARY } from './glossary.ts';
import { GUIDES } from './guides.ts';

test('واژه‌نامه: شناسه و واژه یکتا، تعریف کوتاه ولی کامل', () => {
    assert.ok(GLOSSARY.length >= 25, `فقط ${GLOSSARY.length} واژه`);
    assert.equal(new Set(GLOSSARY.map((t) => t.id)).size, GLOSSARY.length);
    assert.equal(new Set(GLOSSARY.map((t) => t.term)).size, GLOSSARY.length);
    for (const t of GLOSSARY) {
        assert.match(t.id, /^[a-z0-9-]+$/, t.id);
        assert.ok(t.definition.length >= 25 && t.definition.length <= 280, `${t.id} (${t.definition.length})`);
    }
});

test('واژه‌نامه: راهنمای مرتبطِ هر واژه وجود دارد', () => {
    const slugs = new Set(GUIDES.map((g) => g.slug));
    for (const t of GLOSSARY) if (t.guide) assert.ok(slugs.has(t.guide), `${t.id} → ${t.guide}`);
});

test('واژه‌نامه: عیارهای ۱۸ و ۲۴ با هزارم درست آمده‌اند', () => {
    const text = GLOSSARY.find((t) => t.id === 'hezarom')?.definition ?? '';
    for (const pair of ['۷۵۰', '۸۷۵', '۹۱۶', '۹۹۹']) assert.ok(text.includes(pair), pair);
});
