'use client';

// React
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Statics And Types
import { BOOKING_STATUS_LABEL, ORDER_STATUS_LABEL, type NotifyPrefs } from '@/dto/order';

// Components
import ProductPhoto from '@/components/shared/product-photo';
import { marketPricesOptions } from '@/service/api/market';
import PlatformNotice from '@/components/shared/platform-notice';
import { Icon } from '@/components/icon';
import FavoriteButton from '@/components/sellers/favorite-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Services
import {
    cancelBooking,
    cancelOrder,
    GET_FAVORITES,
    GET_LOYALTY,
    GET_MY_BOOKINGS,
    GET_MY_ORDERS,
    GET_MY_PLANS,
    GET_NOTIFICATIONS,
    GET_PROFILE,
    getFavorites,
    getLoyalty,
    getMyBookings,
    getMyOrders,
    getMyPlans,
    getNotifications,
    getProfile,
    readAllNotifications,
    readNotification,
    updateProfile,
} from '@/service/api/account';
import { logout, setSessionName } from '@/service/auth-store';
import { disablePush, enablePush } from '@/service/push';

// Utils And Hooks
import { useSession } from '@/hooks/use-session';
import { formatJalali, formatJalaliDateTime } from '@/utils/date-time';
import { formatPrice, toPersianDigits } from '@/utils/number';
import { showError, showSuccess } from '@/utils/toast';

const nameSchema = z.object({
    name: z.string().trim().min(2, 'نام را وارد کنید').max(60, 'حداکثر ۶۰ نویسه'),
});
type NameValues = z.infer<typeof nameSchema>;

type Tab = 'orders' | 'favorites' | 'bookings' | 'plans' | 'inbox';

const TABS: { value: Tab; label: string }[] = [
    { value: 'orders', label: 'سفارش‌ها' },
    { value: 'favorites', label: 'علاقه‌مندی' },
    { value: 'bookings', label: 'بازدیدها' },
    { value: 'plans', label: 'اقساط و باشگاه' },
    { value: 'inbox', label: 'اعلان‌ها' },
];

const CHANNELS: { key: keyof NotifyPrefs; label: string; hint?: string }[] = [
    { key: 'sms', label: 'پیامک' },
    { key: 'bale', label: 'بله' },
    { key: 'eitaa', label: 'ایتا' },
    { key: 'push', label: 'اعلان مرورگر', hint: 'آزمایشی' },
];

const errorText = (error: unknown, fallback: string): string =>
    error instanceof Error ? error.message : fallback;

export default function AccountPage() {
    const router = useRouter();
    const { session, ready } = useSession();
    const [tab, setTab] = useState<Tab>('orders');
    const inbox = useQuery({ queryKey: [GET_NOTIFICATIONS], queryFn: getNotifications, enabled: Boolean(session) });
    const unread = inbox.data?.data?.unread ?? 0;
    /** بعد از «خروج» به خانه می‌رویم، نه صفحه‌ی ورود */
    const leaving = useRef(false);

    useEffect(() => {
        if (ready && !session && !leaving.current) router.replace('/login?next=/account');
    }, [ready, session, router]);

    if (!ready || !session) {
        return (
            <main className="container-page py-8">
                <Skeleton className="h-48 rounded-2xl" />
            </main>
        );
    }

    return (
        <main className="container-page max-w-3xl py-8">
            <section className="bg-navy-glow rounded-2xl p-5 text-white">
                <div className="flex items-center gap-4">
                    <span className="bg-gold-sheen inline-flex size-14 items-center justify-center rounded-full text-xl font-bold text-brand-950">
                        {session.name.slice(0, 1)}
                    </span>
                    <div>
                        <h1 className="text-lg font-bold">{session.name}</h1>
                        <p className="latin-nums text-sm text-brand-200">{session.phone}</p>
                    </div>
                </div>
            </section>

            <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-6">
                <TabsList className="w-full overflow-x-auto">
                    {TABS.map((t) => (
                        <TabsTrigger key={t.value} value={t.value}>
                            {t.label}
                            {t.value === 'inbox' && unread > 0 ? (
                                <span className="ms-1 inline-flex min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-brand-950">
                                    {toPersianDigits(unread)}
                                </span>
                            ) : null}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="mt-4">
                {tab === 'orders' ? <OrdersTab /> : null}
                {tab === 'favorites' ? <FavoritesTab /> : null}
                {tab === 'bookings' ? <BookingsTab /> : null}
                {tab === 'plans' ? <PlansTab /> : null}
                {tab === 'inbox' ? <InboxTab /> : null}
            </div>

            <Button
                type="button"
                variant="outline"
                size="lg"
                className="mt-8 w-full text-danger-700"
                onClick={() => {
                    leaving.current = true;
                    void logout();
                    router.replace('/');
                }}
            >
                <Icon name="log-out" />
                خروج از حساب
            </Button>
        </main>
    );
}

function Empty({
    title,
    hint,
    href,
    cta,
}: {
    title: string;
    hint?: string;
    href?: string;
    cta?: string;
}) {
    return (
        <div className="rounded-2xl border border-dashed bg-card px-6 py-12 text-center">
            <p className="font-semibold">{title}</p>
            {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
            {href && cta ? (
                <Button asChild variant="gold" className="mt-4">
                    <Link href={href}>{cta}</Link>
                </Button>
            ) : null}
        </div>
    );
}

function OrdersTab() {
    const queryClient = useQueryClient();
    const orders = useQuery({ queryKey: [GET_MY_ORDERS], queryFn: getMyOrders });
    const cancel = useMutation({
        mutationFn: cancelOrder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [GET_MY_ORDERS] });
            showSuccess('سفارش لغو شد');
        },
        onError: (e: unknown) => showError(errorText(e, 'لغو سفارش ناموفق بود')),
    });
    const list = orders.data?.data ?? [];

    if (orders.isLoading) return <Skeleton className="h-28 rounded-2xl" />;
    if (list.length === 0)
        return (
            <Empty
                title="هنوز سفارشی ثبت نکرده‌اید"
                hint="از فهرست فروشندگان، کاتالوگ را ببینید و سفارش بدهید."
                href="/sellers"
                cta="دیدن فروشندگان"
            />
        );
    return (
        <div className="space-y-4">
            <PlatformNotice />
            <ul className="stagger space-y-3">
                {list.map((o) => (
                    <li key={o.id} className="hover-lift rounded-2xl border bg-card p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <Link
                                    href={`/account/orders/${o.id}`}
                                    className="font-semibold hover:underline"
                                >
                                    {o.shopName}
                                </Link>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    کد پیگیری: <bdi className="break-all">{o.trackingCode}</bdi> · {formatJalali(o.createdAt)}
                                </p>
                            </div>
                            <Badge variant="gold">{ORDER_STATUS_LABEL[o.status]}</Badge>
                        </div>
                        <ul className="mt-3 divide-y border-y text-sm">
                            {o.items.map((it, i) => (
                                <li key={i} className="flex items-center gap-3 py-4">
                                    <ProductPhoto src={it.imageUrl} title={it.title} />
                                    <div className="flex-1"><p className="font-semibold">{it.title}</p><p className="mt-1 text-xs text-muted-foreground">{toPersianDigits(it.karat)} عیار · {toPersianDigits(it.weightGram)} گرم</p>{it.conditions ? <p className="mt-2 text-sm text-muted-foreground">{it.conditions}</p> : null}</div>
                                    <span>× {toPersianDigits(it.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                        {o.note ? (
                            <p className="mt-3 rounded-lg bg-muted p-3 text-sm">{o.note}</p>
                        ) : null}
                        {o.cancellationReason ? <p className="mt-3 text-sm text-danger-700">علت لغو: {o.cancellationReason}</p> : null}
                        <Button asChild variant="gold" className="mt-3 me-2"><Link href={`/account/orders/${o.id}`}>پیگیری و ادامه سفارش</Link></Button>
                        {o.status === 'new' ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                disabled={cancel.isPending}
                                onClick={() => cancel.mutate(o.id)}
                            >
                                لغو سفارش
                            </Button>
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function FavoritesTab() {
    const prices = useQuery(marketPricesOptions);
    const favorites = useQuery({ queryKey: [GET_FAVORITES], queryFn: getFavorites });
    const f = favorites.data?.data;
    if (favorites.isLoading) return <Skeleton className="h-28 rounded-2xl" />;
    if (!f || (f.shops.length === 0 && f.items.length === 0))
        return (
            <Empty
                title="علاقه‌مندی‌ای ندارید"
                hint="با قلب روی صفحه‌ی فروشنده یا قلم کاتالوگ، آن را اینجا نگه دارید."
                href="/sellers"
                cta="دیدن فروشندگان"
            />
        );
    return (
        <div className="space-y-5">
            {f.shops.length ? (
                <section>
                    <h2 className="mb-2 text-sm font-semibold">فروشندگان</h2>
                    <ul className="stagger space-y-2">
                        {f.shops.map((s) => (
                            <li
                                key={s.slug}
                                className="flex items-center justify-between rounded-2xl border bg-card p-3"
                            >
                                <Link href={`/sellers/${s.slug}`} className="min-w-0">
                                    <p className="truncate font-semibold">{s.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {s.city} · امتیاز {toPersianDigits(s.rating)}
                                    </p>
                                </Link>
                                <FavoriteButton target={{ kind: 'shop', slug: s.slug }} />
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
            {f.items.length ? (
                <section>
                    <h2 className="mb-2 text-sm font-semibold">اقلام</h2>
                    <ul className="stagger space-y-2">
                        {f.items.map((i) => (
                            <li
                                key={i.id}
                                className="flex items-center justify-between rounded-2xl border bg-card p-3"
                            >
                                <ProductPhoto src={i.imageUrl} title={i.title} />
                                <Link href={`/sellers/${i.shopSlug}#item-${i.id}`} className="min-w-0 flex-1 px-3 focus-visible:underline">
                                    <p className="font-semibold">{i.title}</p>
                                    <p className="mt-1 text-sm text-gold-700">{prices.data?.data && !prices.data.data.stale && i.estimatedTotal > 0 ? `${formatPrice(i.estimatedTotal)} تومان (تخمینی)` : 'قیمت نیاز به استعلام دارد'}</p>
                                    {i.conditions ? <p className="my-2 text-sm text-muted-foreground">{i.conditions}</p> : null}
                                    <p className="my-1 text-xs font-semibold">{i.inStock ? 'مشاهده کالا و ادامه خرید ←' : 'فعلاً ناموجود · مشاهده کالا'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {toPersianDigits(i.karat)} عیار ·{' '}
                                        {toPersianDigits(i.weightGram)} گرم · {i.shopName}
                                    </p>
                                </Link>
                                <FavoriteButton
                                    target={{ kind: 'item', id: i.id, title: i.title }}
                                />
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </div>
    );
}

function BookingsTab() {
    const queryClient = useQueryClient();
    const bookings = useQuery({ queryKey: [GET_MY_BOOKINGS], queryFn: getMyBookings });
    const cancel = useMutation({
        mutationFn: cancelBooking,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [GET_MY_BOOKINGS] });
            showSuccess('بازدید لغو شد');
        },
        onError: (e: unknown) => showError(errorText(e, 'لغو ناموفق بود')),
    });
    const list = bookings.data?.data ?? [];
    if (bookings.isLoading) return <Skeleton className="h-28 rounded-2xl" />;
    if (list.length === 0)
        return (
            <Empty
                title="بازدیدی رزرو نکرده‌اید"
                hint="از صفحه‌ی هر فروشنده می‌توانید وقت بازدید حضوری بگیرید."
                href="/sellers"
                cta="دیدن فروشندگان"
            />
        );
    return (
        <ul className="stagger space-y-3">
            {list.map((b) => (
                <li key={b.id} className="hover-lift rounded-2xl border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                        <Link
                            href={`/sellers/${b.shopSlug}`}
                            className="font-semibold hover:underline"
                        >
                            {b.shopName}
                        </Link>
                        <Badge variant="gold">{BOOKING_STATUS_LABEL[b.status]}</Badge>
                    </div>
                    <p className="mt-1 text-sm">{formatJalaliDateTime(b.slotAt)}</p>
                    {b.note ? <p className="mt-1 text-xs text-muted-foreground">{b.note}</p> : null}
                    {b.status === 'pending' || b.status === 'confirmed' ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            disabled={cancel.isPending}
                            onClick={() => cancel.mutate(b.id)}
                        >
                            لغو
                        </Button>
                    ) : null}
                </li>
            ))}
        </ul>
    );
}

function PlansTab() {
    const plans = useQuery({ queryKey: [GET_MY_PLANS], queryFn: getMyPlans });
    const loyalty = useQuery({ queryKey: [GET_LOYALTY], queryFn: getLoyalty });
    const list = plans.data?.data ?? [];
    const club = loyalty.data?.data ?? [];

    if (plans.isLoading || loyalty.isLoading) return <Skeleton className="h-28 rounded-2xl" />;
    if (list.length === 0 && club.length === 0)
        return (
            <Empty
                title="طرح قسطی یا امتیازی ندارید"
                hint="اقساط، پس‌انداز طلا و امتیاز باشگاه شما که فروشگاه برایتان ثبت کند، اینجا دیده می‌شود."
            />
        );
    return (
        <div className="space-y-5">
            {list.length ? (
                <section>
                    <h2 className="mb-2 text-sm font-semibold">اقساط و پس‌انداز طلا</h2>
                    <ul className="stagger space-y-3">
                        {list.map((p) => {
                            const saving = p.kind === 'gold_saving';
                            const pct = saving
                                ? p.targetGram > 0
                                    ? (p.savedGram / p.targetGram) * 100
                                    : 0
                                : p.totalToman > 0
                                  ? (p.paidToman / p.totalToman) * 100
                                  : 0;
                            return (
                                <li
                                    key={p.id}
                                    className="hover-lift rounded-2xl border bg-card p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">{p.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {p.shopName}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={p.status === 'active' ? 'gold' : 'secondary'}
                                        >
                                            {p.status === 'active' ? 'در جریان' : 'پایان‌یافته'}
                                        </Badge>
                                    </div>
                                    <Progress value={Math.min(100, pct)} className="mt-3" />
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {saving
                                            ? `${toPersianDigits(p.savedGram)} از ${toPersianDigits(p.targetGram)} گرم`
                                            : `${formatPrice(p.paidToman)} از ${formatPrice(p.totalToman)} تومان`}
                                        {p.nextDue ? ` · قسط بعدی ${formatJalali(p.nextDue)}` : ''}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">
                        پرداخت قسط حضوری و در خود فروشگاه ثبت می‌شود؛ پرداخت آنلاین هنوز فعال نیست.
                    </p>
                </section>
            ) : null}
            {club.length ? (
                <section>
                    <h2 className="mb-2 text-sm font-semibold">باشگاه مشتریان</h2>
                    <ul className="stagger space-y-2">
                        {club.map((c) => (
                            <li
                                key={c.shopSlug}
                                className="flex items-center justify-between rounded-2xl border bg-card p-4"
                            >
                                <div>
                                    <Link
                                        href={`/sellers/${c.shopSlug}`}
                                        className="font-semibold hover:underline"
                                    >
                                        {c.shopName}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        {c.tier === 'vip'
                                            ? 'عضو ویژه'
                                            : c.tier === 'regular'
                                              ? 'عضو عادی'
                                              : 'عضو جدید'}
                                    </p>
                                </div>
                                <div className="text-end">
                                    <p className="font-bold text-gold-700">
                                        {toPersianDigits(c.points)} امتیاز
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        معادل {formatPrice(c.redeemableToman)} تومان تخفیف
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </div>
    );
}

function InboxTab() {
    const queryClient = useQueryClient();
    const notifications = useQuery({ queryKey: [GET_NOTIFICATIONS], queryFn: getNotifications });
    const profile = useQuery({ queryKey: [GET_PROFILE], queryFn: getProfile });

    const nameForm = useForm<NameValues>({
        resolver: zodResolver(nameSchema),
        values: { name: profile.data?.data?.name ?? '' },
    });
    const saveName = useMutation({
        mutationFn: (v: NameValues) => updateProfile({ name: v.name }),
        onSuccess: async (res) => {
            if (res.data) setSessionName(res.data.name);
            await queryClient.invalidateQueries({ queryKey: [GET_PROFILE] });
            showSuccess('نام شما به‌روز شد');
        },
        onError: (e: unknown) => showError(errorText(e, 'ذخیره‌ی نام ناموفق بود')),
    });
    const readOne = useMutation({
        mutationFn: readNotification,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [GET_NOTIFICATIONS] }),
    });
    const readAll = useMutation({
        mutationFn: readAllNotifications,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [GET_NOTIFICATIONS] }),
    });
    const prefs = useMutation({
        mutationFn: async ({ key, on }: { key: keyof NotifyPrefs; on: boolean }) => {
            const current = profile.data?.data?.notify;
            if (!current) return;
            if (key === 'push') {
                if (on) await enablePush();
                else await disablePush();
            }
            await updateProfile({ notify: { ...current, [key]: on } });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [GET_PROFILE] }),
        onError: (e: unknown) => showError(errorText(e, 'ذخیره‌ی تنظیم ناموفق بود')),
    });

    const list = notifications.data?.data?.items ?? [];
    const notify = profile.data?.data?.notify;

    return (
        <div className="space-y-5">
            <section className="rounded-2xl border bg-card p-4">
                <h2 className="mb-3 text-sm font-semibold">نام نمایشی</h2>
                <Form {...nameForm}>
                    <form
                        onSubmit={nameForm.handleSubmit((v) => saveName.mutate(v))}
                        className="flex items-start gap-3"
                        noValidate
                    >
                        <FormField
                            control={nameForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="sr-only">نام و نام خانوادگی</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant="gold" disabled={saveName.isPending}>
                            ذخیره
                        </Button>
                    </form>
                </Form>
            </section>

            <section className="rounded-2xl border bg-card p-4">
                <h2 className="text-sm font-semibold">از چه راهی خبر بگیرم؟</h2>
                <p className="mt-1 mb-3 text-xs text-muted-foreground">
                    اعلان درون‌برنامه همیشه فعال است. ارسال پیامک، بله و ایتا هنوز به سرویس واقعی
                    وصل نیست و فقط ثبت می‌شود.
                </p>
                <ul className="divide-y">
                    {CHANNELS.map((c) => (
                        <li
                            key={c.key}
                            className="flex items-center justify-between py-2.5 text-sm"
                        >
                            <span>
                                {c.label}
                                {c.hint ? (
                                    <span className="ms-1.5 text-xs text-muted-foreground">
                                        ({c.hint})
                                    </span>
                                ) : null}
                            </span>
                            <Switch
                                checked={notify?.[c.key] ?? false}
                                disabled={!notify || prefs.isPending}
                                onCheckedChange={(on) => prefs.mutate({ key: c.key, on })}
                                aria-label={c.label}
                            />
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">پیام‌ها</h2>
                    {list.some((n) => !n.readAt) ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={readAll.isPending}
                            onClick={() => readAll.mutate()}
                        >
                            همه خوانده شد
                        </Button>
                    ) : null}
                </div>
                {notifications.isLoading ? <Skeleton className="h-20 rounded-2xl" /> : null}
                <ul className="stagger space-y-2">
                    {list.map((n) => (
                        <li
                            key={n.id}
                            className={`rounded-2xl border bg-card p-4 ${n.readAt ? 'opacity-70' : ''}`}
                        >
                            <p className="text-sm font-semibold">{n.subject}</p>
                            <p className="mt-1 text-sm leading-7 text-muted-foreground">{n.body}</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                {formatJalaliDateTime(n.createdAt)}
                            </p>
                            {!n.readAt ? (
                                <Button
                                    variant="ghost"
                                    size="xs"
                                    className="mt-1"
                                    disabled={readOne.isPending}
                                    onClick={() => readOne.mutate(n.id)}
                                >
                                    خوانده شد
                                </Button>
                            ) : null}
                        </li>
                    ))}
                    {!notifications.isLoading && list.length === 0 ? (
                        <li className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
                            پیامی ندارید.
                        </li>
                    ) : null}
                </ul>
            </section>
        </div>
    );
}
