// React
import Link from 'next/link';
import Image from 'next/image';

// Statics And Types
import { BRAND } from '@/constants/brand';

// Components

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
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-xs">
                <Image
                    src="/kardast-logo.png"
                    width={48}
                    height={48}
                    alt=""
                    className="size-full object-contain"
                />
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
