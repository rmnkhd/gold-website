import { NextResponse, type NextRequest } from 'next/server';

/**
 * سیاست امنیت محتوا با nonce (فقط production؛ dev به eval و websocket نیاز دارد).
 *
 * `script-src` بدون `'unsafe-inline'`: فقط اسکریپت‌هایی اجرا می‌شوند که nonce همین درخواست را دارند
 * (Next خودش روی اسکریپت‌های فریم‌ورک می‌گذارد) و `strict-dynamic` بارگذاری‌های بعدیِ آن‌ها را مجاز می‌کند؛
 * تزریق `<script>` یا `onerror=` توسط مهاجم اجرا نمی‌شود. شرط: صفحه‌ها پویا رندر شوند (`force-dynamic` در layout).
 * `style-src 'unsafe-inline'` می‌ماند چون framer-motion و leaflet خصوصیت `style` درون‌خطی می‌نویسند؛
 * استایل درون‌خطی راه اجرای کد نیست.
 */
export function proxy(request: NextRequest) {
    if (process.env.NODE_ENV !== 'production') return NextResponse.next();

    const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8090').origin;
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const csp = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
        "style-src 'self' 'unsafe-inline'",
        // کاشی نقشه و عکس کالا از https یا data/blob؛ عکس‌های API هم از https
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        `connect-src 'self' ${apiOrigin}`,
        "worker-src 'self'",
        "manifest-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
    ].join('; ');

    const headers = new Headers(request.headers);
    headers.set('x-nonce', nonce);
    headers.set('Content-Security-Policy', csp);
    const response = NextResponse.next({ request: { headers } });
    response.headers.set('Content-Security-Policy', csp);
    return response;
}

export const config = {
    matcher: [
        {
            source: '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon.png|manifest.webmanifest|sw.js).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
