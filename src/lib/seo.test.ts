import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { breadcrumbLd, pageMetadata } from './seo.ts';

describe('pageMetadata', () => {
    it('canonical و og:url اختصاصی صفحه است، نه خانه', () => {
        const m = pageMetadata({ title: 'قیمت طلا و سکه', description: 'توضیح', path: '/prices' });
        assert.equal(m.alternates?.canonical, '/prices');
        assert.equal((m.openGraph as { url: string }).url, '/prices');
        assert.equal((m.twitter as { card: string }).card, 'summary_large_image');
    });

    it('عنوان Open Graph همان عنوان نمایشی با نام برند است', () => {
        const m = pageMetadata({ title: 'قیمت طلا و سکه', description: 'توضیح', path: '/prices' });
        assert.match((m.openGraph as { title: string }).title, /^قیمت طلا و سکه \| .+/);
    });

    it('absoluteTitle پسوند برند نمی‌گیرد', () => {
        const m = pageMetadata({ title: 'خانه', description: 'd', path: '/', absoluteTitle: true });
        assert.deepEqual(m.title, { absolute: 'خانه' });
        assert.equal((m.openGraph as { title: string }).title, 'خانه');
    });
});

describe('breadcrumbLd', () => {
    it('خانه را اول می‌گذارد و موقعیت‌ها پیوسته‌اند', () => {
        const ld = breadcrumbLd([{ name: 'فروشندگان', path: '/sellers' }]) as {
            itemListElement: { position: number; item: string }[];
        };
        assert.equal(ld.itemListElement.length, 2);
        assert.deepEqual(
            ld.itemListElement.map((x) => x.position),
            [1, 2]
        );
        assert.ok(ld.itemListElement[1].item.endsWith('/sellers'));
        assert.ok(!ld.itemListElement[0].item.endsWith('/'));
    });
});
