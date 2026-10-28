import assert from 'node:assert/strict';
import test from 'node:test';

import { GUIDES } from './guides.ts';
import { MORE_GUIDES } from './guides-more.ts';
import { PRICE_INSTRUMENTS } from './price-instruments.ts';

test('راهنماها: slug یکتا و ساختار کامل', () => {
    assert.ok(GUIDES.length >= 17, `فقط ${GUIDES.length} راهنما`);
    assert.equal(new Set(GUIDES.map((g) => g.slug)).size, GUIDES.length, 'slug تکراری');
    for (const g of GUIDES) {
        assert.match(g.slug, /^[a-z0-9-]+$/, g.slug);
        assert.ok(g.title.length >= 10 && g.title.length <= 90, `${g.slug} title`);
        assert.ok(g.description.length >= 60 && g.description.length <= 200, `${g.slug} description (${g.description.length})`);
        assert.match(g.publishedIso, /^\d{4}-\d{2}-\d{2}$/, g.slug);
        assert.ok(g.readingMinutes >= 1 && g.readingMinutes <= 12, g.slug);
        assert.ok(g.sections.length >= 2, `${g.slug} sections`);
        for (const s of g.sections) {
            assert.ok(s.heading.length >= 3, g.slug);
            assert.ok(s.paragraphs.length >= 1 && s.paragraphs.every((p) => p.trim().length >= 20), `${g.slug} / ${s.heading}`);
        }
    }
});

test('راهنماها: عنوان و توضیح یکتا (جلوگیری از محتوای تکراری)', () => {
    assert.equal(new Set(GUIDES.map((g) => g.title)).size, GUIDES.length);
    assert.equal(new Set(GUIDES.map((g) => g.description)).size, GUIDES.length);
});

test('راهنماها: هیچ ادعای قطعی درباره‌ی آینده‌ی قیمت یا توصیه‌ی خرید ندارند', () => {
    const text = GUIDES.flatMap((g) => g.sections.flatMap((s) => s.paragraphs)).join(' ');
    assert.doesNotMatch(text, /قطعاً (گران|ارزان) می‌شود|حتماً بخرید|تضمین سود/);
});

test('صفحه‌های قیمت: هر راهنمای ارجاع‌شده وجود دارد', () => {
    const slugs = new Set(GUIDES.map((g) => g.slug));
    for (const i of PRICE_INSTRUMENTS) for (const slug of i.guides) assert.ok(slugs.has(slug), `${i.slug} → ${slug}`);
});

test('راهنماهای موتور محتوا: دست‌کم سه بخش و دست‌کم ۳ دقیقه مطالعه', () => {
    for (const g of MORE_GUIDES) {
        assert.ok(g.sections.length >= 3, g.slug);
        assert.ok(g.readingMinutes >= 3, g.slug);
    }
});

test('پیوند داخلی: هر راهنما ۲ تا ۳ هم‌موضوع و دست‌کم ۲ پیوند معتبر دارد', async () => {
    const { GUIDE_LINKS } = await import('./guide-links.ts');
    const { GLOSSARY } = await import('./glossary.ts');
    const slugs = new Set(GUIDES.map((g) => g.slug));
    const glossaryIds = new Set(GLOSSARY.map((t) => t.id));
    const priceSlugs = new Set(PRICE_INSTRUMENTS.map((i) => i.slug));
    const fixed = new Set(['/calculator', '/compare', '/sellers', '/prices', '/glossary']);
    for (const g of GUIDES) {
        const m = GUIDE_LINKS[g.slug];
        assert.ok(m, `پیوند ندارد: ${g.slug}`);
        assert.ok(m.related.length >= 2 && m.related.length <= 3, `${g.slug} related`);
        assert.equal(new Set(m.related).size, m.related.length, `${g.slug} related تکراری`);
        for (const r of m.related) assert.ok(slugs.has(r) && r !== g.slug, `${g.slug} → ${r}`);
        assert.ok(m.links.length >= 2, `${g.slug} links`);
        for (const l of m.links) {
            const ok =
                fixed.has(l.href) ||
                (l.href.startsWith('/prices/') && priceSlugs.has(l.href.slice(8))) ||
                (l.href.startsWith('/glossary#') && glossaryIds.has(l.href.slice(10)));
            assert.ok(ok, `${g.slug}: پیوند ناموجود ${l.href}`);
            assert.ok(l.label.length >= 5, l.href);
        }
    }
    for (const key of Object.keys(GUIDE_LINKS)) assert.ok(slugs.has(key), `کلید اضافه: ${key}`);
});
