'use client';

// React
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Statics And Types
import { OTP_LENGTH, loginSchema, safeNext, type LoginValues } from './login-schema';
import { BRAND } from '@/constants/brand';

// Components
import Logo from '@/components/layout/logo';
import MoltenGold from '@/components/motion/molten-gold';
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

// Services
import { loginOrRegister, requestOtp } from '@/service/auth-store';

// Utils And Hooks
import { showError, showSuccess } from '@/utils/toast';

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}

/** ورود و ثبت‌نام در یک جریان: شماره → کد → (اگر حساب ندارد) نام */
function LoginForm() {
    const router = useRouter();
    const next = safeNext(useSearchParams().get('next'));
    const [codeSent, setCodeSent] = useState(false);
    const [devCode, setDevCode] = useState<string | null>(null);
    const [isNewUser, setIsNewUser] = useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { phone: '', code: '', name: '' },
    });

    const onSubmit = async (values: LoginValues) => {
        try {
            if (!codeSent) {
                const otp = await requestOtp(values.phone);
                setDevCode(otp.devCode ?? null);
                setIsNewUser(otp.isNewUser);
                setCodeSent(true);
                showSuccess('کد تأیید ارسال شد');
                return;
            }
            if (values.code.length !== OTP_LENGTH) {
                form.setError('code', { message: 'کد ۶ رقمی را وارد کنید' });
                return;
            }
            if (isNewUser && values.name.trim().length < 2) {
                form.setError('name', { message: 'نام و نام خانوادگی را وارد کنید' });
                return;
            }
            await loginOrRegister(values.phone, values.code, values.name);
            router.replace(next);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'خطای ناشناخته';
            if (codeSent) form.setError('code', { message });
            else showError(message);
        }
    };

    return (
        <main className="bg-navy-glow relative flex min-h-[85dvh] flex-col items-center justify-center px-5 py-10 overflow-hidden">
            <MoltenGold />
            <div className="animate-pop relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
                <Logo className="mb-6" />
                <h1 className="text-xl font-bold">ورود / ثبت‌نام</h1>
                <p className="mt-1 mb-6 text-sm text-muted-foreground">
                    برای ثبت سفارش و پیگیری آن وارد شوید. اگر حساب ندارید، همین‌جا ساخته می‌شود.
                </p>

                <Form {...form}>
                    <form
                        method="post"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>شماره موبایل</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="tel"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            placeholder="09123456789"
                                            className="latin-nums"
                                            disabled={codeSent}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {codeSent ? (
                            <>
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>کد تأیید</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    inputMode="numeric"
                                                    autoComplete="one-time-code"
                                                    maxLength={6}
                                                    className="latin-nums text-center tracking-[0.5em]"
                                                />
                                            </FormControl>
                                            {devCode ? (
                                                <div className="flex items-center justify-between rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
                                                    <span>
                                                        کد شما (نسخه‌ی آزمایشی، پیامک متصل نیست):{' '}
                                                        <span className="latin-nums text-base font-bold tracking-widest">
                                                            {devCode}
                                                        </span>
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="shrink-0 font-semibold whitespace-nowrap underline"
                                                        onClick={() => field.onChange(devCode)}
                                                    >
                                                        پر کن
                                                    </button>
                                                </div>
                                            ) : null}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {isNewUser ? (
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>نام و نام خانوادگی</FormLabel>
                                                <FormControl>
                                                    <Input {...field} autoComplete="name" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : null}
                            </>
                        ) : null}
                        {/* key متفاوت: وگرنه همان کلیکِ «ادامه» فرمِ مرحله‌ی بعد را هم submit می‌کند */}
                        <Button
                            key={codeSent ? 'submit' : 'next'}
                            type="submit"
                            variant="gold"
                            size="lg"
                            className="w-full"
                            disabled={form.formState.isSubmitting}
                        >
                            {codeSent ? (isNewUser ? 'ساخت حساب و ورود' : 'ورود') : 'دریافت کد'}
                        </Button>
                    </form>
                </Form>
            </div>
        <p className="animate-rise relative mt-6 text-xl font-extrabold">
            <span className="text-gold-flow">{BRAND.slogan}</span>
        </p>
        </main>
    );
}
