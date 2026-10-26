'use client';

// Assets
import './globals.css';

/** خطایی که خودِ لایه‌ی ریشه را بشکند؛ باید `html` و `body` را خودش بسازد */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="fa" dir="rtl">
            <body className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center text-foreground">
                <h1 className="text-xl font-bold">مشکلی پیش آمد</h1>
                <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
                    برنامه بارگذاری نشد. صفحه را دوباره باز کنید.
                </p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-6 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-brand-950"
                >
                    تلاش دوباره
                </button>
            </body>
        </html>
    );
}
