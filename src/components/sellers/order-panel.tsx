'use client';

// React
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

// Statics And Types
import type { Seller } from '@/dto/market';
import { PLATFORM_NOTICE } from '@/statics/platform-notice';

// Components
import { Icon } from '@/components/icon';
import ProductPhoto from '@/components/shared/product-photo';
import PlatformNotice from '@/components/shared/platform-notice';
import FavoriteButton from '@/components/sellers/favorite-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

// Services
import { marketPricesOptions } from '@/service/api/market';
import { createOrder, GET_MY_ORDERS } from '@/service/api/account';

// Utils And Hooks
import { useSession } from '@/hooks/use-session';
import { formatPrice, toPersianDigits } from '@/utils/number';
import { showError, showSuccess } from '@/utils/toast';

const MAX_QUANTITY = 9;

const schema = z.object({
    quantities: z.array(z.number().int().min(0).max(MAX_QUANTITY)),
    note: z.string().max(500, 'حداکثر ۵۰۰ نویسه'),
});
type Values = z.infer<typeof schema>;

/** کاتالوگ فروشنده + ثبت سفارش (نیازمند ورود) */
export default function OrderPanel({ seller }: { seller: Seller }) {
    const queryClient = useQueryClient();
    const { session, ready } = useSession();
    const prices = useQuery(marketPricesOptions);
    /** قیمت کهنه یا نامشخص: برآورد نشان داده نمی‌شود */
    const priceUsable = Boolean(prices.data?.data) && !prices.data?.data?.stale;

    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { quantities: seller.catalog.map(() => 0), note: '' },
    });
    const quantities = useWatch({ control: form.control, name: 'quantities' });

    const estimate = (index: number): number => {
        const item = seller.catalog[index];
        if (!item || !priceUsable) return 0;
        // برآورد یک قطعه از سرور (اجرت، سود و مالیات همین فروشگاه)
        return item.estimatedTotal * Math.max(quantities[index] ?? 0, 1);
    };

    const selected = seller.catalog
        .map((item, i) => ({ item, quantity: quantities[i] ?? 0, index: i }))
        .filter((s) => s.quantity > 0);
    const total = selected.reduce((sum, s) => sum + estimate(s.index), 0);

    const setQuantity = (index: number, value: number) => {
        const next = [...form.getValues('quantities')];
        next[index] = Math.min(MAX_QUANTITY, Math.max(0, value));
        form.setValue('quantities', next, { shouldDirty: true });
    };

    const mutation = useMutation({
        mutationFn: createOrder,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [GET_MY_ORDERS] });
            showSuccess('سفارش شما برای فروشنده ارسال شد');
        },
        onError: (error: unknown) =>
            showError(error instanceof Error ? error.message : 'ثبت سفارش ناموفق بود'),
    });

    const onSubmit = (values: Values) => {
        if (!session) return;
        mutation.mutate({
            sellerSlug: seller.slug,
            note: values.note.trim() || undefined,
            items: seller.catalog
                .map((item, i) => ({ itemId: item.id, quantity: values.quantities[i] ?? 0 }))
                .filter((it) => it.quantity > 0),
        });
    };

    return (
        <section className="mt-8" aria-labelledby="catalog-title">
            <h2 id="catalog-title" className="mb-1 text-xl font-bold">
                کاتالوگ و ثبت سفارش
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
                قلم‌های مورد نظر را انتخاب کنید؛ فروشنده با شما تماس می‌گیرد و سفارش را تأیید
                می‌کند. قیمت‌ها تخمینی و بر اساس قیمت روز است.
            </p>
            {mutation.isSuccess ? null : <PlatformNotice className="mb-5" />}

            {mutation.isSuccess ? (
                <div
                    role="status"
                    className="space-y-4 rounded-2xl border border-success-500/40 bg-success-50 p-5"
                >
                    <p className="flex items-center gap-2 text-lg font-bold text-success-700">
                        <Icon name="check" className="size-5" />
                        سفارش شما ثبت شد
                    </p>
                    <PlatformNotice text={PLATFORM_NOTICE.afterOrder} />
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="gold">
                            <Link href={`/account/orders/${mutation.data?.data?.id}`}>پیگیری و ادامه سفارش</Link>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                mutation.reset();
                                form.reset();
                            }}
                        >
                            ثبت سفارش دیگر
                        </Button>
                    </div>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {seller.catalog.map((item, i) => {
                                const qty = quantities[i] ?? 0;
                                return (
                                    <li
                                        key={item.id}
                                        id={`item-${item.id}`}
                                        className="flex scroll-mt-24 flex-wrap items-center gap-4 rounded-2xl border bg-card p-5 shadow-sm"
                                    >
                                        <ProductPhoto src={item.imageUrl} title={item.title} />
                                        <div className="min-w-0 flex-1 basis-40">
                                            <p className="text-lg font-semibold">{item.title}</p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {toPersianDigits(item.karat)} عیار ·{' '}
                                                {toPersianDigits(item.weightGram)} گرم · اجرت{' '}
                                                {toPersianDigits(item.wagePercent)}٪
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-gold-700">
                                                {estimate(i) > 0 ? `≈ ${formatPrice(estimate(i))} تومان` : 'قیمت تازه در دسترس نیست؛ استعلام از فروشنده'}
                                            </p>
                                        </div>
                                        {item.conditions ? <p className="order-last w-full border-t pt-3 text-sm leading-7 text-muted-foreground">{item.conditions}</p> : null}
                                        <FavoriteButton
                                            target={{
                                                kind: 'item',
                                                id: item.id,
                                                title: item.title,
                                            }}
                                        />
                                        {item.inStock ? (
                                            <div className="flex items-center gap-1.5">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon-sm"
                                                    aria-label={`کم کردن ${item.title}`}
                                                    disabled={qty === 0}
                                                    onClick={() => setQuantity(i, qty - 1)}
                                                >
                                                    <Icon name="minus" />
                                                </Button>
                                                <span
                                                    className="w-6 text-center text-sm font-semibold"
                                                    aria-live="polite"
                                                >
                                                    {toPersianDigits(qty)}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon-sm"
                                                    aria-label={`افزودن ${item.title}`}
                                                    disabled={qty >= MAX_QUANTITY}
                                                    onClick={() => setQuantity(i, qty + 1)}
                                                >
                                                    <Icon name="plus" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Badge variant="secondary">ناموجود</Badge>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>توضیحات (اختیاری)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            rows={2}
                                            placeholder="مثلاً زمان مناسب برای تماس یا سایز"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="bg-navy-glow rounded-2xl p-5 text-white">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-brand-200">
                                    {toPersianDigits(selected.length)} قلم انتخاب‌شده
                                </span>
                                <span className="text-gold-sheen text-xl font-extrabold">
                                    {total > 0 ? formatPrice(total) : 'نیاز به استعلام'}
                                    {total > 0 && (
                                        <span className="ms-1 text-xs font-medium text-brand-200">
                                            تومان (تخمینی)
                                        </span>
                                    )}
                                </span>
                            </div>
                            {ready && !session ? (
                                <Button asChild variant="gold" size="lg" className="mt-4 w-full">
                                    <Link
                                        href={`/login?next=${encodeURIComponent(`/sellers/${seller.slug}`)}`}
                                    >
                                        برای ثبت سفارش وارد شوید
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="gold"
                                    size="lg"
                                    className="mt-4 w-full"
                                    disabled={selected.length === 0 || mutation.isPending || !ready}
                                >
                                    {mutation.isPending ? 'در حال ارسال…' : 'ثبت سفارش'}
                                </Button>
                            )}
                            <PlatformNotice variant="compact" onDark className="mt-3" />
                        </div>
                    </form>
                </Form>
            )}
        </section>
    );
}
