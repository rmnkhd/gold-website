// Statics And Types
import type { EventName } from '@/lib/analytics';

// Services
import { API_URL } from '@/service/http-client';

// Utils And Hooks
import { buildEvent, shouldTrack, type EventPayload } from '@/lib/analytics';

interface NavigatorPrivacy {
    doNotTrack?: string | null;
    globalPrivacyControl?: boolean;
}

const allowed = (): boolean => typeof navigator !== 'undefined' && shouldTrack(navigator as unknown as NavigatorPrivacy);

/** فرستادن رویداد بدون کوکی و بدون انتظار؛ خطا هرگز تجربه‌ی کاربر را خراب نمی‌کند. */
function send(payload: EventPayload): void {
    if (!allowed()) return;
    try {
        void fetch(`${API_URL}/v1/public/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true,
        }).catch(() => undefined);
    } catch {
        /* noop */
    }
}

export function trackPageview(pathname: string, referrer?: string): void {
    send(buildEvent({ app: 'site', kind: 'pageview', pathname, search: window.location.search, referrer }));
}

/** رویداد کاربری (نام از فهرست مجاز)؛ مسیر = صفحه‌ی فعلی. */
export function track(name: EventName): void {
    send(buildEvent({ app: 'site', kind: 'event', name, pathname: window.location.pathname, search: window.location.search }));
}
