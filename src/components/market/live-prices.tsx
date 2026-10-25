'use client';

// Components
import PriceBoard from '@/components/market/price-board';
import { Skeleton } from '@/components/ui/skeleton';

// Utils And Hooks
import { useMarketPrices } from '@/hooks/use-market-prices';
import { cn } from '@/lib/utils';

/** کارت قیمت لحظه‌ای سایت — منطق نمایش در `PriceBoard` */
export default function LivePrices({ className }: { className?: string }) {
    const { prices, status, isLoading } = useMarketPrices();

    if (isLoading || !prices || !status) {
        return <Skeleton className={cn('h-44 w-full rounded-2xl', className)} />;
    }
    return (
        <PriceBoard
            prices={prices}
            status={status}
            ariaLabel="قیمت لحظه‌ای بازار طلا"
            className={className}
        />
    );
}
