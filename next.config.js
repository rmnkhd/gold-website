const isProd = process.env.NODE_ENV === 'production';
const apiOrigin = new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8090').origin;

/**
 * سیاست امنیت محتوا (فقط production؛ dev به eval و websocket نیاز دارد).
 * `'unsafe-inline'` برای اسکریپت‌های درون‌خطی Next و JSON-LD لازم است؛ بدون nonce راه دیگری نیست.
 * تصویر: کاشی نقشه و عکس کالا از https یا data/blob؛ API فقط مبدأ خودش.
 */
const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
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

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',

    /**
     * پوشه‌ی خروجی، قابل‌تغییر با متغیر محیطی.
     *
     * هوکِ pre-push با `NEXT_DIST_DIR=.next-verify` بیلد می‌گیرد تا به
     * پوشه‌ی سرورِ dev دست نزند. بدون این، `yarn build` بیلدِ **تولید** را
     * در همان `.next` می‌ریخت و سرورِ dev بعدی روی آن **همه‌ی مسیرها را
     * ۴۰۴** می‌داد — حتی `/` — بی‌هیچ خطایی در لاگ.
     *
     * همان باگی که در سایت رفع شده بود ولی در پنل از قلم افتاد
     * → `gold-vault/issues`
     */
    distDir: process.env.NEXT_DIST_DIR || '.next',

    images: {
        remotePatterns: [],
    },

    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: '@svgr/webpack', options: { dimensions: false } }],
        });
        return config;
    },

    turbopack: {
        root: __dirname,
        rules: {
            '*.svg': {
                loaders: [{ loader: '@svgr/webpack', options: { dimensions: false } }],
                as: '*.js',
            },
        },
        resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'],
    },

    headers: () => [
        {
            source: '/:path*',
            headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
                ...(isProd
                    ? [
                          { key: 'Content-Security-Policy', value: csp },
                          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                      ]
                    : []),
            ],
        },
        // برای `/_next/static` هدر دستی نمی‌گذاریم — Next خودش روی دارایی‌های
        // هش‌دار `immutable` ست می‌کند و هدر دستی رفتار dev را می‌شکند.
    ],
};

module.exports = nextConfig;
