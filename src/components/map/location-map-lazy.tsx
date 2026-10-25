'use client';

// React
import dynamic from 'next/dynamic';

// Components
import { Skeleton } from '@/components/ui/skeleton';

/** نقشه بدون SSR و lazy تا باندل صفحه سبک بماند */
const LocationMap = dynamic(() => import('@/components/map/location-map'), {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
});

export default LocationMap;
