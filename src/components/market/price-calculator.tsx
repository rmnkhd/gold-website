'use client';

// React
import { useEffect, useRef } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

// Statics And Types
import type { CalculatorConfig } from '@/dto/market';

// Components
import CountUp from '@/components/motion/count-up';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

// Services
import { track } from '@/service/analytics';
import { calculateJewelry, GET_CALCULATE, GET_CALCULATOR_CONFIG, getCalculatorConfig } from '@/service/api/market';

// Utils And Hooks
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { formatPrice, toPersianDigits } from '@/utils/number';

const calcSchema = z.object({
    karat: z.string().min(1),
    weightGram: z
        .number({ message: 'وزن را وارد کنید' })
        .positive('وزن باید بیشتر از صفر باشد')
        .max(10_000, 'وزن نامعتبر است'),
    wagePercent: z.number({ message: 'درصد اجرت را وارد کنید' }).min(0).max(100),
    profitPercent: z.number({ message: 'درصد سود را وارد کنید' }).min(0).max(100),
});

type CalcValues = z.infer<typeof calcSchema>;

const numberValue = (value: number) => (Number.isNaN(value) ? '' : value);

/** محاسبه‌گر شفاف قیمت جواهر: طلا + اجرت + سود + مالیات (فقط روی اجرت و سود) — همه‌ی عددها از سرور */
export default function PriceCalculator() {
    const config = useQuery({
        queryKey: [GET_CALCULATOR_CONFIG],
        queryFn: getCalculatorConfig,
        staleTime: 10 * 60_000,
    });

    if (!config.data?.data) {
        return config.isError ? (
            <p className="rounded-2xl border border-dashed bg-card p-6 text-sm text-muted-foreground">
                ارتباط با سرور برقرار نشد؛ کمی بعد دوباره امتحان کنید.
            </p>
        ) : (
            <Skeleton className="h-72 w-full rounded-2xl" />
        );
    }
    return <CalculatorForm config={config.data.data} />;
}

function CalculatorForm({ config }: { config: CalculatorConfig }) {
    const form = useForm<CalcValues>({
        resolver: zodResolver(calcSchema),
        defaultValues: {
            karat: String(config.karats[0]),
            weightGram: config.defaultWeightGram,
            wagePercent: config.defaultWagePercent,
            profitPercent: config.defaultProfitPercent,
        },
    });
    const values = useWatch({ control: form.control });

    const params = {
        karat: Number(values.karat),
        weight: values.weightGram ?? NaN,
        wagePercent: values.wagePercent ?? NaN,
        profitPercent: values.profitPercent ?? NaN,
    };
    const valid =
        params.weight > 0 &&
        !Number.isNaN(params.wagePercent) &&
        !Number.isNaN(params.profitPercent);
    const debounced = useDebouncedValue(valid ? JSON.stringify(params) : '', 300);
    const tracked = useRef(false);
    useEffect(() => {
        // اولین محاسبه‌ی معتبر در هر بار بازدید = «استفاده از محاسبه‌گر»
        if (debounced !== '' && !tracked.current && form.formState.isDirty) {
            tracked.current = true;
            track('calc_used');
        }
    }, [debounced, form.formState.isDirty]);
    const result = useQuery({
        queryKey: [GET_CALCULATE, debounced],
        queryFn: () => calculateJewelry(JSON.parse(debounced)),
        enabled: debounced !== '',
        placeholderData: keepPreviousData,
        retry: false,
    });
    const breakdown = valid && debounced !== '' ? result.data?.data : undefined;

    return (
        <div className="grid gap-5 lg:grid-cols-2">
            <Form {...form}>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-4 rounded-2xl border bg-card p-5"
                    noValidate
                >
                    <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                        <FormField
                            control={form.control}
                            name="karat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>عیار</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {config.karats.map((k) => (
                                                <SelectItem key={k} value={String(k)}>
                                                    {toPersianDigits(k)} عیار
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weightGram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>وزن (گرم)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            inputMode="decimal"
                                            step="any"
                                            name={field.name}
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            value={numberValue(field.value)}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="wagePercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>اجرت ساخت (٪)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            inputMode="decimal"
                                            step="any"
                                            name={field.name}
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            value={numberValue(field.value)}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="profitPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>سود فروشنده (٪)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            inputMode="decimal"
                                            step="any"
                                            name={field.name}
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            value={numberValue(field.value)}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <p className="text-xs leading-6 text-muted-foreground">
                        درصد اجرت و سود را از فروشنده بپرسید و اینجا وارد کنید تا قیمت منصفانه را
                        بسنجید.
                    </p>
                </form>
            </Form>

            <section aria-live="polite" className="bg-navy-glow rounded-2xl p-5 text-white">
                <h2 className="mb-4 text-sm font-semibold text-brand-200">قیمت تخمینی</h2>
                {breakdown ? (
                    <dl className="space-y-2.5 text-sm">
                        <div className="flex items-center justify-between text-xs text-brand-300">
                            <dt>
                                مبنا: قیمت هر گرم {toPersianDigits(breakdown.karat)} عیار
                            </dt>
                            <dd>{formatPrice(Math.round(breakdown.pricePerGram))} تومان</dd>
                        </div>
                        <Row label="ارزش طلا" value={breakdown.goldValue} />
                        <Row label="اجرت ساخت" value={breakdown.wage} />
                        <Row label="سود فروشنده" value={breakdown.profit} />
                        <Row
                            label={`مالیات (${toPersianDigits(breakdown.vatPercent)}٪ اجرت و سود)`}
                            value={breakdown.vat}
                        />
                        <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-4">
                            <dt className="font-semibold">جمع کل</dt>
                            <dd className="text-gold-sheen text-2xl font-extrabold">
                                <CountUp
                                    value={breakdown.total}
                                    duration={0.6}
                                    format={(n) => formatPrice(Math.round(n))}
                                />
                                <span className="ms-1 text-xs font-medium text-brand-200">
                                    تومان
                                </span>
                            </dd>
                        </div>
                    </dl>
                ) : result.isError ? (
                    <p className="text-sm text-danger-50">{result.error.message}</p>
                ) : (
                    <p className="text-sm text-brand-200">مقادیر معتبر وارد کنید.</p>
                )}
            </section>
        </div>
    );
}

function Row({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center justify-between">
            <dt className="text-brand-200">{label}</dt>
            <dd className="font-medium">
                <CountUp value={value} duration={0.5} format={(n) => formatPrice(Math.round(n))} />
            </dd>
        </div>
    );
}
