// React
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'مقایسه‌ی قیمت جواهر میان فروشندگان',
    description:
        'وزن و عیار جواهر را بزنید و قیمت تخمینی همان قلم را نزد فروشندگان تأییدشده مقایسه کنید؛ اجرت و مالیات شفاف.',
    alternates: { canonical: '/compare' },
};

export default function CompareLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
