'use client';
import { use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ORDER_STATUS_LABEL, type OrderStatus } from '@/dto/order';
import { useSession } from '@/hooks/use-session';
import { GET_MY_ORDERS, getMyOrders, cancelOrder } from '@/service/api/account';
import ProductPhoto from '@/components/shared/product-photo';
import PlatformNotice from '@/components/shared/platform-notice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatJalaliDateTime } from '@/utils/date-time';
import { toPersianDigits } from '@/utils/number';

const STEPS: OrderStatus[] = ['new', 'confirmed', 'ready', 'completed'];
const NEXT: Record<OrderStatus, string> = {
    new: 'سفارش برای بررسی فروشنده ثبت شده است. پس از تأیید، برای هماهنگی قیمت نهایی و پرداخت با فروشنده تماس بگیرید.',
    confirmed: 'فروشنده سفارش را تأیید کرده است. قیمت نهایی، روش پرداخت و زمان تحویل را مستقیم با فروشنده هماهنگ کنید.',
    ready: 'سفارش آماده تحویل است. پیش از مراجعه، زمان و نشانی تحویل را با فروشنده هماهنگ کنید.',
    completed: 'فروشنده تحویل سفارش را ثبت کرده است. برای پیگیری فاکتور و خدمات پس از فروش با فروشنده تماس بگیرید.',
    cancelled: 'این سفارش بسته شده است. می‌توانید از کاتالوگ فروشنده سفارش تازه‌ای ثبت کنید.',
};

export default function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { session, ready } = useSession();
    const router = useRouter();
    const cache = useQueryClient();
    const orders = useQuery({ queryKey: [GET_MY_ORDERS], queryFn: getMyOrders, enabled: ready && !!session, refetchInterval: 30000 });
    const cancel = useMutation({ mutationFn: cancelOrder, onSuccess: () => cache.invalidateQueries({ queryKey: [GET_MY_ORDERS] }) });
    useEffect(() => { if (ready && !session) router.replace(`/login?next=${encodeURIComponent(`/account/orders/${id}`)}`); }, [ready, session, router, id]);
    const order = orders.data?.data?.find((o) => o.id === id);
    return <main className="container-page max-w-3xl space-y-5 py-8">
        <Link href="/account" className="text-sm text-muted-foreground hover:underline">بازگشت به سفارش‌ها</Link>
        {!ready || orders.isLoading ? <p role="status">در حال دریافت سفارش…</p> : orders.isError ? <p role="alert">دریافت سفارش ناموفق بود؛ دوباره تلاش کنید.</p> : !order ? <p>سفارش پیدا نشد.</p> : <>
            <header className="bg-navy-glow space-y-3 rounded-2xl p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-xl font-bold">سفارش از {order.shopName}</h1><Badge variant="gold">{ORDER_STATUS_LABEL[order.status]}</Badge></div>
                <p className="text-xs leading-7">کد پیگیری یکتا: <bdi className="break-all font-semibold">{order.trackingCode}</bdi></p>
                <p className="text-sm text-brand-200">{formatJalaliDateTime(order.createdAt)} · {order.customerName}</p>
            </header>
            {order.status !== 'cancelled' ? <ol aria-label="مراحل سفارش" className="grid grid-cols-2 gap-2 sm:grid-cols-4">{STEPS.map((step, index) => <li key={step} aria-current={order.status === step ? 'step' : undefined} className={`rounded-xl border p-3 text-center text-xs ${STEPS.indexOf(order.status) >= index ? 'border-gold-500 bg-gold-50 font-semibold' : 'text-muted-foreground'}`}>{toPersianDigits(index + 1)} · {ORDER_STATUS_LABEL[step]}</li>)}</ol> : null}
            <section className="space-y-3 rounded-2xl border bg-card p-5"><h2 className="font-bold">مرحله بعد</h2><p className="text-sm leading-7">{NEXT[order.status]}</p>{order.cancellationReason ? <p className="rounded-xl bg-muted p-3 text-sm">علت لغو: {order.cancellationReason}</p> : null}<div className="flex flex-wrap gap-2">{order.shopPhone ? <Button asChild variant="gold"><a href={`tel:${order.shopPhone}`}>تماس با فروشنده</a></Button> : null}<Button asChild variant="outline"><Link href={`/sellers/${order.shopSlug}`}>کاتالوگ و نشانی فروشنده</Link></Button></div></section>
            <ul className="divide-y rounded-2xl border bg-card px-5">{order.items.map((item, i) => <li key={i} className="flex gap-4 py-5"><ProductPhoto src={item.imageUrl} title={item.title} /><div className="min-w-0 space-y-2"><h2 className="font-semibold">{item.title}</h2><p className="text-xs text-muted-foreground">{toPersianDigits(item.quantity)} عدد · {toPersianDigits(item.karat)} عیار · {toPersianDigits(item.weightGram)} گرم</p>{item.conditions ? <p className="text-sm leading-7">{item.conditions}</p> : null}</div></li>)}</ul>
            {order.note ? <p className="rounded-xl border p-4 text-sm">توضیحات شما: {order.note}</p> : null}
            <PlatformNotice />
            {order.status === 'new' ? <Button variant="outline" disabled={cancel.isPending} onClick={() => cancel.mutate(order.id)}>لغو سفارش</Button> : null}
            {cancel.isError ? <p role="alert" className="text-sm text-danger-700">لغو انجام نشد؛ وضعیت سفارش را بررسی کنید.</p> : null}
        </>}
    </main>;
}
