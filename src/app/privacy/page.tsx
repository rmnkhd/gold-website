// React
import type { Metadata } from 'next';

// Statics And Types
import { getInfoPage } from '@/statics/pages';

// Components
import InfoPageView from '@/components/shared/info-page';

// Utils And Hooks
import { pageMetadata } from '@/lib/seo';

const page = getInfoPage('privacy');

export const metadata: Metadata = pageMetadata({
    title: page.title,
    description: page.description,
    path: '/privacy',
});

export default function Page() {
    return <InfoPageView slug="privacy" />;
}
