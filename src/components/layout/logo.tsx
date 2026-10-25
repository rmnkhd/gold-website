// React
import Link from 'next/link';

// Statics And Types
import { BRAND } from '@/constants/brand';

// Components
import { Icon } from '@/components/icon';

// Utils And Hooks
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    /** روی سطح لاجوردی متن روشن می‌شود */
    tone?: 'light' | 'dark';
}

export default function Logo({ className, tone = 'light' }: LogoProps) {
    return (
        <Link
            href="/"
            className={cn('group inline-flex items-center gap-2.5', className)}
            aria-label={`${BRAND.name} — صفحه‌ی اصلی`}
        >
            <span className="bg-gold-sheen inline-flex size-9 items-center justify-center rounded-xl text-brand-950 shadow-xs transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Icon name="gem" className="size-5" />
            </span>
            <span
                className={cn(
                    'text-lg font-bold tracking-tight',
                    tone === 'dark' ? 'text-white' : 'text-foreground'
                )}
            >
                {BRAND.name}
            </span>
        </Link>
    );
}
