import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

type Handler = (event: Record<string, unknown>) => void;

interface FakeRes {
    ok: boolean;
    status: number;
    body: string;
    clone: () => FakeRes;
    text: () => Promise<string>;
}

const res = (body: string, status = 200): FakeRes => {
    const r: FakeRes = { ok: status >= 200 && status < 300, status, body, clone: () => res(body, status), text: async () => body };
    return r;
};

const OFFLINE_HTML = '<link rel="stylesheet" href="/_next/static/css/app.css"><script src="/_next/static/chunks/main.js"></script>';

/** service worker واقعی (public/sw.js) را در یک sandbox با cache/fetch ساختگی اجرا می‌کند. */
const load = (network: Record<string, FakeRes | 'fail'>) => {
    const handlers: Record<string, Handler> = {};
    const stores = new Map<string, Map<string, FakeRes>>();
    const key = (r: string | { url: string }) => new URL(typeof r === 'string' ? r : r.url, 'https://zarineh.test').pathname;
    const caches = {
        open: async (name: string) => {
            if (!stores.has(name)) stores.set(name, new Map());
            const s = stores.get(name)!;
            return {
                addAll: async (urls: string[]) => {
                    for (const u of urls) {
                        const r = await fetchFn({ url: u });
                        s.set(key(u), r);
                    }
                },
                put: async (r: { url: string }, v: FakeRes) => void s.set(key(r), v),
                keys: async () => [...s.keys()].map((u) => ({ url: u })),
                delete: async (r: { url: string }) => s.delete(key(r)),
                match: async (r: string | { url: string }) => s.get(key(r)),
            };
        },
        match: async (r: string | { url: string }) => {
            for (const s of stores.values()) if (s.has(key(r))) return s.get(key(r));
            return undefined;
        },
        keys: async () => [...stores.keys()],
        delete: async (n: string) => stores.delete(n),
    };
    const fetchFn = async (r: string | { url: string }) => {
        const hit = network[key(r)];
        if (!hit || hit === 'fail') throw new TypeError('network down');
        return hit;
    };
    const self = {
        location: { origin: 'https://zarineh.test' },
        addEventListener: (type: string, h: Handler) => void (handlers[type] = h),
        skipWaiting: () => undefined,
        clients: { claim: () => undefined },
    };
    vm.runInNewContext(readFileSync(new URL('../../public/sw.js', import.meta.url), 'utf8'), {
        self,
        caches,
        fetch: fetchFn,
        URL,
        Promise,
    });
    const run = async (type: string, event: Record<string, unknown>) => {
        let pending: Promise<unknown> | undefined;
        handlers[type]({ ...event, waitUntil: (p: Promise<unknown>) => (pending = p), respondWith: (p: Promise<unknown>) => (pending = p) });
        return pending;
    };
    return { run, stores, handlers };
};

test('install precaches the offline page and the static assets it needs', async () => {
    const sw = load({ '/offline': res(OFFLINE_HTML), '/_next/static/css/app.css': res('css'), '/_next/static/chunks/main.js': res('js') });
    await sw.run('install', {});
    const cached = [...[...sw.stores.values()][0].keys()];
    assert.deepEqual(cached.sort(), ['/_next/static/chunks/main.js', '/_next/static/css/app.css', '/offline']);
});

test('install does not fail when an offline asset cannot be fetched', async () => {
    const sw = load({ '/offline': res(OFFLINE_HTML) });
    await sw.run('install', {});
    assert.ok([...sw.stores.values()][0].has('/offline'));
});

test('a navigation falls back to the cached offline page when the network is down', async () => {
    const sw = load({ '/offline': res(OFFLINE_HTML), '/prices': 'fail' });
    await sw.run('install', {});
    const out = (await sw.run('fetch', { request: { method: 'GET', url: 'https://zarineh.test/prices', mode: 'navigate' } })) as FakeRes;
    assert.equal(out.body, OFFLINE_HTML);
});

const nav = (path: string) => ({ request: { method: 'GET', url: 'https://zarineh.test' + path, mode: 'navigate' } });

test('a public page seen online is served from cache when offline (last known content)', async () => {
    const net: Record<string, FakeRes | 'fail'> = { '/offline': res(OFFLINE_HTML), '/prices': res('<h1>قیمت</h1>') };
    const sw = load(net);
    await sw.run('install', {});
    await sw.run('fetch', nav('/prices'));
    await new Promise((r) => setTimeout(r, 10));
    net['/prices'] = 'fail';
    const out = (await sw.run('fetch', nav('/prices'))) as FakeRes;
    assert.equal(out.body, '<h1>قیمت</h1>');
});

test('personal pages are never cached', async () => {
    const sw = load({ '/offline': res(OFFLINE_HTML), '/account': res('<p>اطلاعات شخصی</p>'), '/login': res('login') });
    await sw.run('install', {});
    await sw.run('fetch', nav('/account'));
    await sw.run('fetch', nav('/login'));
    await new Promise((r) => setTimeout(r, 10));
    for (const store of sw.stores.values()) {
        assert.equal(store.has('/account'), false);
        assert.equal(store.has('/login'), false);
    }
});

test('visited-pages cache is capped (oldest dropped)', async () => {
    const net: Record<string, FakeRes | 'fail'> = { '/offline': res(OFFLINE_HTML) };
    for (let i = 0; i < 50; i++) net['/p' + i] = res('page' + i);
    const sw = load(net);
    await sw.run('install', {});
    for (let i = 0; i < 50; i++) {
        await sw.run('fetch', nav('/p' + i));
        await new Promise((r) => setTimeout(r, 0));
    }
    const pages = sw.stores.get('zarineh-pages-v4')!;
    assert.equal(pages.size, 40);
    assert.equal(pages.has('/p0'), false);
    assert.equal(pages.has('/p49'), true);
});

test('static cache is capped too', async () => {
    const net: Record<string, FakeRes | 'fail'> = { '/offline': res(OFFLINE_HTML) };
    for (let i = 0; i < 130; i++) net['/_next/static/chunks/c' + i + '.js'] = res('js' + i);
    const sw = load(net);
    await sw.run('install', {});
    for (let i = 0; i < 130; i++) {
        await sw.run('fetch', { request: { method: 'GET', url: 'https://zarineh.test/_next/static/chunks/c' + i + '.js', mode: 'no-cors' } });
        await new Promise((r) => setTimeout(r, 0));
    }
    assert.ok(sw.stores.get('zarineh-v4')!.size <= 120);
});

test('a failed static asset response is never cached', async () => {
    const sw = load({ '/offline': res(OFFLINE_HTML), '/_next/static/chunks/gone.js': res('nope', 404) });
    await sw.run('install', {});
    await sw.run('fetch', { request: { method: 'GET', url: 'https://zarineh.test/_next/static/chunks/gone.js', mode: 'no-cors' } });
    await new Promise((r) => setTimeout(r, 10));
    assert.equal([...sw.stores.values()][0].has('/_next/static/chunks/gone.js'), false);
});

test('non-GET and cross-origin requests are left to the network', async () => {
    const sw = load({ '/offline': res(OFFLINE_HTML) });
    let responded = false;
    sw.handlers.fetch({ request: { method: 'POST', url: 'https://zarineh.test/x', mode: 'cors' }, respondWith: () => (responded = true) });
    sw.handlers.fetch({ request: { method: 'GET', url: 'https://other.test/x', mode: 'cors' }, respondWith: () => (responded = true) });
    assert.equal(responded, false);
});
