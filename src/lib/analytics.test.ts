import assert from 'node:assert/strict';
import test from 'node:test';

import { buildEvent, panelLink, parseUtm, shouldTrack } from './analytics.ts';

test('parseUtm: فقط utm_* مجاز و پاک‌سازی‌شده؛ بقیه‌ی query ذخیره نمی‌شود', () => {
    assert.deepEqual(parseUtm('?utm_source=Instagram&utm_medium=social&utm_campaign=aban&phone=0912&q=secret'), {
        source: 'instagram',
        medium: 'social',
        campaign: 'aban',
    });
    assert.deepEqual(parseUtm(''), {});
    assert.deepEqual(parseUtm('?utm_source=<script>'), {});
});

test('shouldTrack: Do-Not-Track و GPC را رعایت می‌کند', () => {
    assert.equal(shouldTrack({ doNotTrack: '1' }), false);
    assert.equal(shouldTrack({ globalPrivacyControl: true }), false);
    assert.equal(shouldTrack({ doNotTrack: '0' }), true);
    assert.equal(shouldTrack({}), true);
});

test('buildEvent: بازدید صفحه بی‌query و با UTM و ارجاع', () => {
    const e = buildEvent({ app: 'site', kind: 'pageview', pathname: '/prices/gold-18k', search: '?range=all&utm_source=tg', referrer: 'https://t.me/x' });
    assert.equal(e.path, '/prices/gold-18k');
    assert.equal(e.kind, 'pageview');
    assert.equal(e.referrer, 'https://t.me/x');
    assert.deepEqual(e.utm, { source: 'tg' });
    assert.equal(e.name, undefined);
});

test('buildEvent: رویداد نام دارد', () => {
    const e = buildEvent({ app: 'site', kind: 'event', name: 'order_placed', pathname: '/sellers/x', search: '' });
    assert.equal(e.name, 'order_placed');
});

test('panelLink: مقصد ثبت‌نام پنل با UTM مبدأ و صفحه', () => {
    assert.equal(
        panelLink('https://panel.example.ir', '/guides/ojrat-chist'),
        'https://panel.example.ir/register?utm_source=site&utm_medium=cta&utm_campaign=guides-ojrat-chist'
    );
    assert.equal(panelLink('https://panel.example.ir', '/'), 'https://panel.example.ir/register?utm_source=site&utm_medium=cta&utm_campaign=home');
});
