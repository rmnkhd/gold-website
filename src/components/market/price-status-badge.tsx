// Statics And Types
import type { PriceState, PriceStatus } from '@/lib/price-status';

// Components
import { Icon, type IconName } from '@/components/icon';

// Utils And Hooks
import { priceStatusDetail } from '@/lib/price-status';
import { cn } from '@/lib/utils';

const STATE_VIEW: Record<
    PriceState,
    { icon: IconName; label: string; sr: string; tone: string; dot: string }
> = {
    live: {
        icon: 'radio',
        label: 'زنده',
        sr: 'قیمت زنده است',
        tone: 'bg-success-500/15 text-success-50',
        dot: 'bg-success-500 animate-pulse-ring',
    },
    stale: {
        icon: 'alert',
        label: 'قیمت کهنه',
        sr: 'قیمت کهنه است؛ منبع قیمت به‌روز نمی‌شود',
        tone: 'bg-warning-500/20 text-warning-50',
        dot: 'bg-warning-500',
    },
    sample: {
        icon: 'info',
        label: 'قیمت نمونه',
        sr: 'قیمت نمونه است، نه زنده',
        tone: 'bg-gold-300/15 text-gold-100',
        dot: 'bg-gold-300',
    },
    offline: {
        icon: 'wifi-off',
        label: 'آفلاین',
        sr: 'اتصال قطع است؛ آخرین قیمت دریافت‌شده نمایش داده می‌شود',
        tone: 'bg-danger-500/20 text-danger-50',
        dot: 'bg-danger-500',
    },
};

/** نشانگر وضعیت قیمت؛ هرگز قیمت نمونه یا کهنه را «زنده» نشان نمی‌دهد */
export default function PriceStatusBadge({
    status,
    className,
}: {
    status: PriceStatus;
    className?: string;
}) {
    const v = STATE_VIEW[status.state];
    const detail = priceStatusDetail(status);

    return (
        <p
            role="status"
            className={cn(
                'inline-flex flex-wrap items-center gap-x-1.5 rounded-full px-2.5 py-1 text-[11px]',
                v.tone,
                className
            )}
        >
            <span className={cn('size-1.5 shrink-0 rounded-full', v.dot)} aria-hidden="true" />
            <Icon name={v.icon} className="size-3.5" />
            <span className="sr-only">{v.sr}. {detail}. </span>
            <span className="font-semibold" aria-hidden="true">
                {v.label}
            </span>
            <span className="text-white/70" aria-hidden="true">
                · {detail}
            </span>
            {status.source?.includes('gheymat') && <a href="https://gheymat.online" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">قیمت آنلاین</a>}
            {status.source?.includes('talasanj') && <a href="https://talasanj.info" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">قیمت‌ها از طلاسنج</a>}
        </p>
    );
}
