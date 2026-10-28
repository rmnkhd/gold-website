'use client';

// React
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Components
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';

// Services
import {
    GET_FAVORITES,
    getFavorites,
    setFavoriteItem,
    setFavoriteShop,
} from '@/service/api/account';

// Utils And Hooks
import { loginHref } from '@/lib/login-href';
import { useSession } from '@/hooks/use-session';
import { cn } from '@/lib/utils';
import { showError } from '@/utils/toast';

type Target = { kind: 'shop'; slug: string } | { kind: 'item'; id: string; title: string };

/** قلب علاقه‌مندی برای فروشنده یا یک قلم کاتالوگ؛ بدون ورود به صفحه‌ی ورود می‌برد */
export default function FavoriteButton({
    target,
    onDark = false,
}: {
    target: Target;
    onDark?: boolean;
}) {
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const { session } = useSession();
    const favorites = useQuery({
        queryKey: [GET_FAVORITES],
        queryFn: getFavorites,
        enabled: Boolean(session),
    });

    const active =
        target.kind === 'shop'
            ? (favorites.data?.data?.shops ?? []).some((s) => s.slug === target.slug)
            : (favorites.data?.data?.items ?? []).some((i) => i.id === target.id);

    const toggle = useMutation({
        mutationFn: () =>
            target.kind === 'shop'
                ? setFavoriteShop(target.slug, !active)
                : setFavoriteItem(target.id, !active),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [GET_FAVORITES] }),
        onError: (error: unknown) =>
            showError(error instanceof Error ? error.message : 'ثبت علاقه‌مندی ناموفق بود'),
    });

    const label = target.kind === 'shop' ? 'علاقه‌مندی فروشنده' : `علاقه‌مندی ${target.title}`;
    const heart = (
        <Icon
            name="heart"
            className={cn(
                'size-5',
                active ? 'fill-current text-danger-500' : onDark ? 'text-white' : ''
            )}
        />
    );

    if (!session) {
        return (
            <Button asChild variant="ghost" size="icon" aria-label={`${label} (نیازمند ورود)`}>
                <Link href={loginHref(pathname)}>{heart}</Link>
            </Button>
        );
    }
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={label}
            aria-pressed={active}
            disabled={toggle.isPending}
            onClick={() => toggle.mutate()}
        >
            {heart}
        </Button>
    );
}
