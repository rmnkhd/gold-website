'use client';

// React
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

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

// Services
import { marketPricesOptions } from '@/service/api/market';

// Utils And Hooks
import { calcGoldPrice, GOLD_VAT_PERCENT } from '@/lib/gold-pricing';
import { formatPrice, toPersianDigits } from '@/utils/number';

const KARATS = ['18', '21', '22', '24'] as const;

const calcSchema = z.object({
    karat: z.enum(KARATS),
    weightGram: z
        .number({ message: 'وزن را وارد کنید' })
        .positive('وزن باید بیشتر از صفر باشد')
        .max(10_000, 'وزن نامعتبر است'),
    wagePercent: z.number({ message: 'درصد اجرت را وارد کنید' }).min(0).max(100),
    profitPercent: z.number({ message: 'درصد سود را وارد کنید' }).min(0).max(100),
});

type CalcValues = z.infer<typeof calcSchema>;

const numberValue = (value: number) => (Number.isNaN(value) ? '' : value);

/** محاسبه‌گر شفاف قیمت جواهر: طلا + اجرت + سود + مالیات (فقط روی اجرت و سود) */
export default function PriceCalculator() {
    const prices = useQuery(marketPricesOptions);

    const form = useForm<CalcValues>({
        resolver: zodResolver(calcSchema),
        defaultValues: { karat: '18', weightGram: 5, wagePercent: 12, profitPercent: 7 },
    });
    const values = useWatch({ control: form.control });
    const base = prices.data?.data?.gold18 ?? 0;

    const valid =
        base > 0 &&
        values.weightGram !== undefined &&
        values.weightGram > 0 &&
        values.wagePercent !== undefined &&
        !Number.isNaN(values.wagePercent) &&
        values.profitPercent !== undefined &&
        !Number.isNaN(values.profitPercent);

    const breakdown = valid
        ? calcGoldPrice({
              weightGram: values.weightGram ?? 0,
              karat: Number(values.karat),
              pricePerGram18: base,
              wagePercent: values.wagePercent ?? 0,
              profitPercent: values.profitPercent ?? 0,
          })
        : null;

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
                                            {KARATS.map((k) => (
                                                <SelectItem key={k} value={k}>
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
                        <Row label="ارزش طلا" value={breakdown.goldValue} />
                        <Row label="اجرت ساخت" value={breakdown.wage} />
                        <Row label="سود فروشنده" value={breakdown.profit} />
                        <Row
                            label={`مالیات (${toPersianDigits(GOLD_VAT_PERCENT)}٪ اجرت و سود)`}
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
