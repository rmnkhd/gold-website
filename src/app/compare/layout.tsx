// React
import type { Metadata } from 'next';

// Utils And Hooks
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'مقایسه‌ی قیمت جواهر میان فروشندگان',
    description:
        'وزن و عیار جواهر را بزنید و قیمت تخمینی همان قلم را نزد فروشندگان تأییدشده مقایسه کنید؛ اجرت و مالیات شفاف.',
    path: '/compare',
});

export default function CompareLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
