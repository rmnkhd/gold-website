/** نام رویدادهای مجاز؛ هم‌خوان با `analytics.EventNames` بک‌اند و OpenAPI. */
export type EventName =
    | 'calc_used'
    | 'compare_used'
    | 'order_placed'
    | 'booking_placed'
    | 'favorite_added'
    | 'login_succeeded'
    | 'seller_cta_click'
    | 'guide_cta_click'
    | 'phone_click'
    | 'directions_click';

export interface Utm {
    source?: string;
    medium?: string;
    campaign?: string;
}

export interface EventPayload {
    app: 'site' | 'panel';
    kind: 'pageview' | 'event';
    name?: EventName;
    path: string;
    referrer?: string;
    utm?: Utm;
}

const SAFE = /^[a-z0-9_.-]{1,60}$/;

const clean = (v: string | null): string | undefined => {
    const s = (v ?? '').trim().toLowerCase();
    return SAFE.test(s) ? s : undefined;
};

/** فقط `utm_*`ِ پاک‌سازی‌شده؛ بقیه‌ی query ممکن است داده‌ی شخصی داشته باشد و هرگز فرستاده نمی‌شود. */
export function parseUtm(search: string): Utm {
    const p = new URLSearchParams(search);
    const out: Utm = {};
    const source = clean(p.get('utm_source'));
    const medium = clean(p.get('utm_medium'));
    const campaign = clean(p.get('utm_campaign'));
    if (source) out.source = source;
    if (medium) out.medium = medium;
    if (campaign) out.campaign = campaign;
    return out;
}

/** احترام به Do-Not-Track و Global Privacy Control؛ سرور هم همین را بررسی می‌کند. */
export function shouldTrack(nav: { doNotTrack?: string | null; globalPrivacyControl?: boolean }): boolean {
    return nav.doNotTrack !== '1' && nav.globalPrivacyControl !== true;
}

export function buildEvent(input: {
    app: EventPayload['app'];
    kind: EventPayload['kind'];
    name?: EventName;
    pathname: string;
    search: string;
    referrer?: string;
}): EventPayload {
    const utm = parseUtm(input.search);
    return {
        app: input.app,
        kind: input.kind,
        ...(input.name ? { name: input.name } : {}),
        path: input.pathname,
        ...(input.referrer ? { referrer: input.referrer } : {}),
        ...(Object.keys(utm).length ? { utm } : {}),
    };
}

/** پیوند «ثبت‌نام فروشگاه» در پنل با مبدأ و صفحه‌ی کلیک، تا قیف طلافروش قابل‌اندازه‌گیری باشد. */
export function panelLink(panelUrl: string, fromPath: string): string {
    const campaign = fromPath.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'home';
    return `${panelUrl.replace(/\/$/, '')}/register?utm_source=site&utm_medium=cta&utm_campaign=${campaign}`;
}
