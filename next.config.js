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
            ],
        },
        // برای `/_next/static` هدر دستی نمی‌گذاریم — Next خودش روی دارایی‌های
        // هش‌دار `immutable` ست می‌کند و هدر دستی رفتار dev را می‌شکند.
    ],
};

module.exports = nextConfig;
