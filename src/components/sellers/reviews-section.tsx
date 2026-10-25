'use client';

// React
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

// Components
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Services
import { saveReview } from '@/service/api/account';
import { GET_SELLER_REVIEWS, getSellerReviews } from '@/service/api/market';

// Utils And Hooks
import { useSession } from '@/hooks/use-session';
import { cn } from '@/lib/utils';
import { formatJalali } from '@/utils/date-time';
import { toPersianDigits } from '@/utils/number';
import { showError, showSuccess } from '@/utils/toast';

function Stars({ value }: { value: number }) {
    return (
        <span
            className="inline-flex text-gold-500"
            role="img"
            aria-label={`${toPersianDigits(value)} از ۵`}
        >
            {Array.from({ length: 5 }, (_, i) => (
                <Icon
                    key={i}
                    name="star"
                    className={cn('size-4', i < value ? 'fill-current' : 'opacity-30')}
                />
            ))}
        </span>
    );
}

interface FormValues {
    body: string;
}

/** نظرات مشتریان؛ فقط کسی که سفارشش تحویل شده می‌تواند نظر بدهد (سرور بررسی می‌کند) */
export default function ReviewsSection({ slug }: { slug: string }) {
    const queryClient = useQueryClient();
    const { session } = useSession();
    const [rating, setRating] = useState(5);
    const form = useForm<FormValues>({ defaultValues: { body: '' } });
    const reviews = useQuery({
        queryKey: [GET_SELLER_REVIEWS, slug],
        queryFn: () => getSellerReviews(slug),
    });

    const mutation = useMutation({
        mutationFn: (v: FormValues) => saveReview(slug, { rating, body: v.body.trim() }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [GET_SELLER_REVIEWS, slug] });
            showSuccess('نظر شما ثبت شد');
            form.reset();
        },
        onError: (error: unknown) =>
            showError(error instanceof Error ? error.message : 'ثبت نظر ناموفق بود'),
    });

    const list = reviews.data?.data ?? [];

    return (
        <section className="mt-10" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="mb-3 text-xl font-bold">
                نظر مشتریان
            </h2>

            <ul className="space-y-3">
                {list.map((r) => (
                    <li key={r.id} className="rounded-2xl border bg-card p-4">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{r.consumerName}</p>
                            <Stars value={r.rating} />
                        </div>
                        {r.body ? <p className="mt-2 text-sm leading-7">{r.body}</p> : null}
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            {formatJalali(r.createdAt)}
                        </p>
                        {r.reply ? (
                            <p className="mt-3 rounded-lg bg-brand-50 p-3 text-sm text-brand-900">
                                پاسخ فروشنده: {r.reply}
                            </p>
                        ) : null}
                    </li>
                ))}
                {!reviews.isLoading && list.length === 0 ? (
                    <li className="rounded-2xl border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
                        هنوز نظری ثبت نشده است.
                    </li>
                ) : null}
            </ul>

            {session ? (
                <form
                    onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
                    className="mt-4 space-y-3 rounded-2xl border bg-card p-4"
                >
                    <p className="text-sm font-semibold">نظر خودتان را بنویسید</p>
                    <div className="flex gap-1" role="radiogroup" aria-label="امتیاز">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <button
                                key={n}
                                type="button"
                                role="radio"
                                aria-checked={rating === n}
                                aria-label={`${toPersianDigits(n)} ستاره`}
                                onClick={() => setRating(n)}
                                className="rounded p-0.5 text-gold-500 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                <Icon
                                    name="star"
                                    className={cn(
                                        'size-6',
                                        n <= rating ? 'fill-current' : 'opacity-30'
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        {...form.register('body')}
                        rows={3}
                        placeholder="تجربه‌ی خرید شما چطور بود؟"
                    />
                    <Button type="submit" variant="gold" disabled={mutation.isPending}>
                        ثبت نظر
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        فقط پس از تحویل یک سفارش از همین فروشنده می‌توانید نظر بدهید.
                    </p>
                </form>
            ) : null}
        </section>
    );
}
