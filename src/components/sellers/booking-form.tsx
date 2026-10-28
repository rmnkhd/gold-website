'use client';

// React
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Components
import { Icon } from '@/components/icon';
import { JalaliDateTimePicker, jalaliToIso } from '@/components/shared/jalali-date-picker';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

// Services
import { createBooking, GET_MY_BOOKINGS } from '@/service/api/account';
import { track } from '@/service/analytics';

// Utils And Hooks
import { loginHref } from '@/lib/login-href';
import { useSession } from '@/hooks/use-session';
import { todayJalali } from '@/utils/date-time';
import { showError, showSuccess } from '@/utils/toast';

const schema = z.object({
    slotAt: z
        .string()
        .min(1, 'زمان بازدید را انتخاب کنید')
        .refine((v) => new Date(v).getTime() > Date.now(), 'زمان باید در آینده باشد'),
    note: z.string().max(300, 'حداکثر ۳۰۰ نویسه'),
});
type Values = z.infer<typeof schema>;

/** رزرو بازدید حضوری از فروشگاه */
export default function BookingForm({ slug }: { slug: string }) {
    const pathname = usePathname();
    const queryClient = useQueryClient();
    const { session, ready } = useSession();
    const [open, setOpen] = useState(false);
    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { slotAt: '', note: '' },
    });

    const mutation = useMutation({
        mutationFn: (v: Values) =>
            createBooking({
                sellerSlug: slug,
                slotAt: new Date(v.slotAt).toISOString(),
                note: v.note.trim() || undefined,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [GET_MY_BOOKINGS] });
            track('booking_placed');
            showSuccess('درخواست بازدید برای فروشنده ارسال شد؛ پس از تأیید خبر می‌دهیم');
            form.reset();
            setOpen(false);
        },
        onError: (error: unknown) =>
            showError(error instanceof Error ? error.message : 'ثبت درخواست ناموفق بود'),
    });

    if (ready && !session) {
        return (
            <Button asChild variant="outline" size="lg" className="mt-3 w-full">
                <Link href={loginHref(pathname)}>
                    <Icon name="calendar" />
                    برای رزرو بازدید وارد شوید
                </Link>
            </Button>
        );
    }

    return (
        <section className="mt-3">
            <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setOpen((v) => !v)}
            >
                <Icon name="calendar" />
                رزرو بازدید حضوری
            </Button>
            {open ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
                        className="mt-3 space-y-3 rounded-2xl border bg-card p-4"
                        noValidate
                    >
                        <FormField
                            control={form.control}
                            name="slotAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>زمان بازدید</FormLabel>
                                    <FormControl>
                                        <JalaliDateTimePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            min={jalaliToIso(todayJalali())}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>توضیح (اختیاری)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            rows={2}
                                            placeholder="مثلاً می‌خواهم ست عروس ببینم"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="gold"
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            ارسال درخواست
                        </Button>
                    </form>
                </Form>
            ) : null}
        </section>
    );
}
