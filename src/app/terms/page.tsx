// React
import type { Metadata } from 'next';

// Statics And Types
import { getInfoPage } from '@/statics/pages';

// Components
import InfoPageView from '@/components/shared/info-page';

// Utils And Hooks
import { pageMetadata } from '@/lib/seo';

const page = getInfoPage('terms');

export const metadata: Metadata = pageMetadata({
    title: page.title,
    description: page.description,
    path: '/terms',
});

export default function Page() {
    return <InfoPageView slug="terms" />;
}
