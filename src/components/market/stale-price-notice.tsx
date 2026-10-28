'use client';

// Components
import { Icon } from '@/components/icon';

// Utils And Hooks
import { useMarketPrices } from '@/hooks/use-market-prices';
import { priceStatusDetail } from '@/lib/price-status';
import { cn } from '@/lib/utils';

/**
 * هشدار کنار هر عددِ برآمده از قیمت روز: وقتی قیمت زنده نیست (کهنه، نمونه یا آفلاین)
 * کاربر باید بداند عدد روی قیمت قدیمی است. قیمت زنده → چیزی نمایش داده نمی‌شود.
 */
export default function StalePriceNotice({ className }: { className?: string }) {
    const { status } = useMarketPrices(5000);
    if (!status || status.state === 'live') return null;

    return (
        <p
            role="status"
            className={cn(
                'flex items-start gap-2 rounded-xl border border-warning-500/40 bg-warning-500/10 px-3 py-2 text-xs leading-6 text-foreground',
                className
            )}
        >
            <Icon name="alert" className="mt-1 size-4 shrink-0 text-warning-700" />
            <span>
                قیمت روز زنده نیست ({priceStatusDetail(status)}). مبلغ‌های این صفحه بر پایه‌ی آخرین قیمت دریافت‌شده
                است؛ پیش از نهایی‌کردن، قیمت را با بازار تطبیق دهید.
            </span>
        </p>
    );
}
