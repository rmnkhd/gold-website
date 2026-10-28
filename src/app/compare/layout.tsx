// React
import type { Metadata } from 'next';

// Components
import JsonLd from '@/components/seo/json-ld';

// Utils And Hooks
import { breadcrumbLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'مقایسه‌ی قیمت جواهر میان فروشندگان',
    description:
        'وزن و عیار جواهر را بزنید و قیمت تخمینی همان قلم را نزد فروشندگان تأییدشده مقایسه کنید؛ اجرت و مالیات شفاف.',
    path: '/compare',
});

export default function CompareLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <JsonLd data={breadcrumbLd([{ name: 'مقایسه‌ی قیمت جواهر', path: '/compare' }])} />
            {children}
        </>
    );
}
