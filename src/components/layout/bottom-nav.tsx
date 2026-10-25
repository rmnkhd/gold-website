'use client';

// React
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

// Statics And Types
import { BOTTOM_NAV } from '@/statics/navigation';

// Components
import { Icon } from '@/components/icon';

// Utils And Hooks
import { cn } from '@/lib/utils';

const isActive = (pathname: string, href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

/** نوار ناوبری پایین موبایل (حس اپ در PWA) */
export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="ناوبری سریع"
            className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-brand-900 lg:hidden"
        >
            <ul className="mx-auto grid max-w-lg grid-cols-6">
                {BOTTOM_NAV.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                                    active ? 'text-gold-300' : 'text-brand-200'
                                )}
                            >
                                {active ? (
                                    <motion.span
                                        layoutId="front-bottom-active"
                                        className="absolute inset-x-4 -top-px h-0.5 rounded-full bg-gold-400"
                                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                    />
                                ) : null}
                                <Icon
                                    name={item.icon}
                                    className={cn('size-5 transition-transform duration-200', active && 'scale-110')}
                                />
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
