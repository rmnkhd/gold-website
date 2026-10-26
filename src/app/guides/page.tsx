// React
import type { Metadata } from 'next';
import Link from 'next/link';

// Statics And Types
import { GUIDES } from '@/statics/guides';

// Components
import PlatformNotice from '@/components/shared/platform-notice';

// Utils And Hooks
import { pageMetadata } from '@/lib/seo';
import { toPersianDigits } from '@/utils/number';

export const metadata: Metadata = pageMetadata({
    title: 'راهنمای خرید طلا و جواهر',
    description: 'راهنماهای کوتاه و کاربردی درباره‌ی اجرت، سود، مالیات و چک‌لیست خرید طلا.',
    path: '/guides',
});

export default function GuidesPage() {
    return (
        <main className="container-page py-8">
            <h1 className="text-2xl font-extrabold lg:text-3xl">راهنمای خرید طلا</h1>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
                مطالب عمومی و آموزشی؛ مشاوره‌ی مالی یا حقوقی نیستند.
            </p>
            <PlatformNotice className="mb-6" />
            <div className="stagger grid gap-4 sm:grid-cols-2">
                {GUIDES.map((g) => (
                    <Link
                        key={g.slug}
                        href={`/guides/${g.slug}`}
                        className="rounded-2xl border bg-card p-5 transition-colors hover:border-gold-300"
                    >
                        <h2 className="font-semibold">{g.title}</h2>
                        <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                            {g.description}
                        </p>
                        <p className="mt-3 text-xs text-gold-700">
                            {toPersianDigits(g.readingMinutes)} دقیقه مطالعه
                        </p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
