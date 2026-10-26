'use client';

// React
import { useEffect } from 'react';
import Link from 'next/link';

// Components
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

/** خطای غیرمنتظره‌ی یک صفحه: کاربر پیام فارسی می‌بیند، نه صفحه‌ی خام Next؛ «تلاش دوباره» همان بخش را دوباره می‌سازد */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="container-page flex flex-col items-center py-24 text-center" role="alert">
            <p className="text-gold-sheen text-5xl font-extrabold">!</p>
            <h1 className="mt-4 text-xl font-bold">مشکلی پیش آمد</h1>
            <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
                این صفحه الان بارگذاری نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button variant="gold" onClick={reset}>
                    تلاش دوباره
                </Button>
                <Button asChild variant="outline">
                    <Link href="/">بازگشت به خانه</Link>
                </Button>
            </div>
        </main>
    );
}
