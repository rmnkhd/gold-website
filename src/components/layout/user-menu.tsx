'use client';

// React
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Components
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Services
import { logout } from '@/service/auth-store';

// Utils And Hooks
import { loginHref } from '@/lib/login-href';
import { useSession } from '@/hooks/use-session';

/** ورود/ثبت‌نام یا منوی حساب مشتری (سفارش‌های من، خروج) */
export default function UserMenu() {
    const router = useRouter();
    const pathname = usePathname();
    const { session, ready } = useSession();

    if (!ready) return <span className="h-8 w-24" aria-hidden="true" />;

    if (!session) {
        return (
            <Button asChild variant="gold" size="sm">
                <Link href={loginHref(pathname)}>ورود / ثبت‌نام</Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="منوی حساب کاربری"
                className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
                <Avatar className="size-8">
                    <AvatarFallback className="bg-brand-800 text-xs text-gold-300">
                        {session.name.slice(0, 1)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>
                    <p className="font-semibold">{session.name}</p>
                    <p className="latin-nums text-xs font-normal text-muted-foreground">
                        {session.phone}
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push('/account')}>
                    <Icon name="shopping-bag" className="size-4" />
                    سفارش‌های من
                </DropdownMenuItem>
                <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => {
                        void logout();
                        router.replace('/');
                    }}
                >
                    <Icon name="log-out" className="size-4" />
                    خروج
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
