// React
import Image from 'next/image';
import type { Metadata } from 'next';

// Components

export const metadata: Metadata = {
    title: 'آفلاین',
    robots: { index: false, follow: false },
};

export default function OfflinePage() {
    return (
        <main className="container-page flex flex-col items-center py-24 text-center">
            <span className="bg-white mb-5 inline-flex size-16 items-center justify-center rounded-2xl p-1 text-brand-950">
                <Image
                    src="/kardast-logo.png"
                    width={56}
                    height={56}
                    alt="کاردست"
                    className="size-full object-contain"
                />
            </span>
            <h1 className="text-xl font-bold">اینترنت شما قطع است</h1>
            <p className="mt-2 max-w-sm text-sm leading-7 text-muted-foreground">
                این صفحه هنوز ذخیره نشده است. وقتی اتصال برقرار شد، دوباره امتحان کنید.
            </p>
        </main>
    );
}
