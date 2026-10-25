// React
import type { Metadata } from 'next';

// Components
import { Icon } from '@/components/icon';

export const metadata: Metadata = {
    title: 'آفلاین',
    robots: { index: false, follow: false },
};

export default function OfflinePage() {
    return (
        <main className="container-page flex flex-col items-center py-24 text-center">
            <span className="bg-gold-sheen mb-5 inline-flex size-16 items-center justify-center rounded-2xl text-brand-950">
                <Icon name="gem" className="size-8" />
            </span>
            <h1 className="text-xl font-bold">اینترنت شما قطع است</h1>
            <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
                این صفحه هنوز ذخیره نشده است. وقتی اتصال برقرار شد، دوباره امتحان کنید.
            </p>
        </main>
    );
}
