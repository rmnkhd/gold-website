/* Service worker زرینه — کش ساده: دارایی‌های استاتیک cache-first، صفحات network-first با فالبک آفلاین */
const CACHE = 'zarineh-v3';
const OFFLINE_URL = '/offline';

/* صفحه‌ی آفلاین همراه دارایی‌هایی که خودش لازم دارد (CSS/JS) پیش‌کش می‌شود؛ وگرنه آفلاین بی‌استایل می‌ماند */
const precacheOffline = async () => {
    const cache = await caches.open(CACHE);
    const res = await fetch(OFFLINE_URL);
    if (!res.ok) return;
    const html = await res.clone().text();
    await cache.put(OFFLINE_URL, res);
    const assets = [...new Set(html.match(/\/_next\/static\/[^"'\s)]+\.(?:css|js)/g) || [])];
    await Promise.all(
        assets.map((a) =>
            fetch(a).then((r) => (r.ok ? cache.put(a, r) : undefined)).catch(() => undefined)
        )
    );
};

self.addEventListener('install', (event) => {
    event.waitUntil(precacheOffline());
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            caches.match(request).then(
                (hit) =>
                    hit ||
                    fetch(request).then((res) => {
                        if (res.ok) {
                            const copy = res.clone();
                            caches.open(CACHE).then((c) => c.put(request, copy));
                        }
                        return res;
                    })
            )
        );
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    }
});

/* اعلان Web Push: بدنه‌ی JSON ؛ تا وصل شدن VAPID (vault: شبیه‌سازی #11) فقط آماده‌ی دریافت است */
self.addEventListener('push', (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch {
        data = { body: event.data ? event.data.text() : '' };
    }
    event.waitUntil(
        self.registration.showNotification(data.title || 'زرینه', {
            body: data.body || '',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            dir: 'rtl',
            lang: 'fa',
            data: { url: data.url || '/account' },
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || '/account';
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
            for (const client of list) {
                if ('focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            return self.clients.openWindow(url);
        })
    );
});
