// Statics And Types
import { PLATFORM_NOTICE } from '@/statics/platform-notice';

// Components
import { Icon } from '@/components/icon';

// Utils And Hooks
import { cn } from '@/lib/utils';

interface PlatformNoticeProps {
    /** `banner` برجسته با عنوان؛ `compact` یک‌خطی کنار دکمه‌ها */
    variant?: 'banner' | 'compact';
    /** متن را عوض می‌کند (مثلاً پس از ثبت سفارش) */
    text?: string;
    /** روی زمینه‌ی لاجوردی */
    onDark?: boolean;
    className?: string;
}

/** هشدار روشن «پلتفرم ارتباطی»؛ متن همه‌جا از `statics/platform-notice.ts` می‌آید */
export default function PlatformNotice({
    variant = 'banner',
    text,
    onDark,
    className,
}: PlatformNoticeProps) {
    if (variant === 'compact') {
        return (
            <p
                role="note"
                className={cn(
                    'flex items-start gap-2 text-xs leading-6',
                    onDark ? 'text-gold-100' : 'text-gold-800',
                    className
                )}
            >
                <Icon name="info" className="mt-1 size-3.5 shrink-0" />
                {text ?? PLATFORM_NOTICE.short}
            </p>
        );
    }

    return (
        <aside
            role="note"
            aria-label="هشدار پلتفرم ارتباطی"
            className={cn(
                'flex items-start gap-3 rounded-2xl border p-4',
                onDark
                    ? 'border-gold-300/50 bg-gold-300/10 text-white'
                    : 'border-gold-300 bg-gold-50 text-gold-950',
                className
            )}
        >
            <span
                className={cn(
                    'inline-flex size-9 shrink-0 items-center justify-center rounded-full',
                    onDark ? 'bg-gold-300/20 text-gold-200' : 'bg-gold-100 text-gold-700'
                )}
            >
                <Icon name="info" className="size-5" />
            </span>
            <div>
                <p className="text-sm font-bold">{PLATFORM_NOTICE.title}</p>
                <p
                    className={cn(
                        'mt-1 text-sm leading-7',
                        onDark ? 'text-brand-100' : 'text-gold-900'
                    )}
                >
                    {text ?? PLATFORM_NOTICE.body}
                </p>
            </div>
        </aside>
    );
}
