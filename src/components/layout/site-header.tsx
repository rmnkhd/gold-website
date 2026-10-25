'use client';

// React
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Statics And Types
import { PANEL_URL } from '@/constants/brand';
import { MAIN_NAV } from '@/statics/navigation';

// Components
import Logo from '@/components/layout/logo';
import UserMenu from '@/components/layout/user-menu';
import { Button } from '@/components/ui/button';

// Utils And Hooks
import { cn } from '@/lib/utils';

const isActive = (pathname: string, href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

/** هدر سایت — ناوبری فقط در دسکتاپ؛ موبایل نوار پایین دارد */
export default function SiteHeader() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-sm">
            <div className="container-page flex h-14 items-center justify-between">
                <Logo />
                <nav aria-label="منوی اصلی" className="hidden items-center gap-1 lg:flex">
                    {MAIN_NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                            className={cn(
                                'link-underline rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive(pathname, item.href)
                                    ? 'text-gold-700'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                        <a href={PANEL_URL}>ورود طلافروشان</a>
                    </Button>
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}
