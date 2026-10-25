'use client';

// React
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Components
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CitySelect from '@/components/shared/city-select';
import { Skeleton } from '@/components/ui/skeleton';

// Services
import { GET_COMPARE, GET_MARKET_INDEX, getCompare, getMarketIndex } from '@/service/api/market';

// Utils And Hooks
import { formatPrice, toPersianDigits } from '@/utils/number';

const schema = z.object({
    karat: z.string().regex(/^(18|21|22|24)$/, 'عیار ۱۸، ۲۱، ۲۲ یا ۲۴'),
    weight: z.string().refine((v) => Number(v) > 0 && Number(v) <= 5000, 'وزن را به گرم وارد کنید'),
    city: z.string().trim(),
});
type Values = z.infer<typeof schema>;

const KINDS: Record<string, string> = { jewelry: 'جواهر', coin: 'سکه', bullion: 'شمش' };

export default function ComparePage() {
    const [query, setQuery] = useState<{ karat: number; weight: number; city?: string } | null>(null);
    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { karat: '18', weight: '5', city: '' },
    });

    const results = useQuery({
        queryKey: [GET_COMPARE, query],
        queryFn: () => getCompare(query as NonNullable<typeof query>),
        enabled: query !== null,
    });
    const index = useQuery({ queryKey: [GET_MARKET_INDEX], queryFn: getMarketIndex });

    const rows = results.data?.data?.sellers ?? [];
    const buckets = index.data?.data?.buckets ?? [];

    return (
        <main className="container-page max-w-3xl py-8">
            <h1 className="text-2xl font-extrabold lg:text-3xl">مقایسه‌ی قیمت میان فروشندگان</h1>
            <p className="mt-2 mb-6 text-sm leading-7 text-muted-foreground">
                قیمت تخمینی یک جواهر با وزن و عیار مشخص، نزد هر فروشنده‌ی تأییدشده — بر پایه‌ی قیمت روز و اجرت همان
                فروشنده. قیمت نهایی را فاکتور فروشنده تعیین می‌کند.
            </p>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((v) =>
                        setQuery({ karat: Number(v.karat), weight: Number(v.weight), city: v.city || undefined })
                    )}
                    className="grid grid-cols-3 gap-3 rounded-2xl border bg-card p-4"
                    noValidate
                >
                    <FormField
                        control={form.control}
                        name="karat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>عیار</FormLabel>
                                <FormControl>
                                    <Input {...field} inputMode="numeric" className="latin-nums" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>وزن (گرم)</FormLabel>
                                <FormControl>
                                    <Input {...field} inputMode="decimal" className="latin-nums" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>شهر (اختیاری)</FormLabel>
                                <FormControl>
                                    <CitySelect value={field.value} onChange={field.onChange} allowAll />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant="gold" size="lg" className="col-span-3">
                        <Icon name="compare" />
                        مقایسه
                    </Button>
                </form>
            </Form>

            {results.isFetching ? <Skeleton className="mt-6 h-40 rounded-2xl" /> : null}

            {query && !results.isFetching ? (
                <ul className="mt-6 space-y-3">
                    {rows.map((r, i) => (
                        <li key={r.slug} className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-4">
                            <div className="min-w-0">
                                <Link href={`/sellers/${r.slug}`} className="font-semibold hover:underline">
                                    {r.name}
                                </Link>
                                <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                    {r.city} · اجرت {toPersianDigits(r.wagePercent)}٪ · امتیاز {toPersianDigits(r.rating)}
                                    {r.verified ? (
                                        <Badge variant="gold">
                                            <Icon name="shield-check" />
                                            تأییدشده
                                        </Badge>
                                    ) : null}
                                </p>
                            </div>
                            <div className="text-end">
                                <p className="text-lg font-extrabold text-gold-700">{formatPrice(r.estimatedTotal)}</p>
                                <p className="text-[11px] text-muted-foreground">
                                    تومان{i === 0 ? ' · ارزان‌ترین' : ''}
                                </p>
                            </div>
                        </li>
                    ))}
                    {rows.length === 0 ? (
                        <li className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
                            فروشنده‌ای با کاتالوگ این عیار پیدا نشد.
                        </li>
                    ) : null}
                </ul>
            ) : null}

            {buckets.length ? (
                <section className="mt-10" aria-labelledby="index-title">
                    <h2 id="index-title" className="text-lg font-bold">
                        میانگین اجرت بازار
                    </h2>
                    <p className="mt-1 mb-3 text-xs leading-6 text-muted-foreground">
                        آمار ناشناس و تجمیع‌شده از فاکتورهای فروشگاه‌های مشارکت‌کننده؛ هیچ فروشگاهی جداگانه قابل
                        شناسایی نیست.
                    </p>
                    <ul className="divide-y rounded-2xl border bg-card">
                        {buckets.map((b) => (
                            <li key={`${b.city}-${b.kind}`} className="flex items-center justify-between p-4 text-sm">
                                <span>
                                    {b.city} · {KINDS[b.kind] ?? b.kind}
                                </span>
                                <span className="font-semibold">{toPersianDigits(b.avgWagePercent)}٪</span>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </main>
    );
}
