// React
import type { Metadata } from 'next';
import Link from 'next/link';

// Components
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'صفحه پیدا نشد',
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <main className="container-page flex flex-col items-center py-24 text-center">
            <p className="text-gold-sheen text-6xl font-extrabold">۴۰۴</p>
            <h1 className="mt-4 text-xl font-bold">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
            <Button asChild variant="gold" className="mt-6">
                <Link href="/">بازگشت به خانه</Link>
            </Button>
        </main>
    );
}
