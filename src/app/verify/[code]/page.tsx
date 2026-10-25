// React
import type { Metadata } from 'next';
import Link from 'next/link';

// Components
import { Icon } from '@/components/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Services
import { getCertificate } from '@/service/api/market';

// Utils And Hooks
import { formatJalaliLong } from '@/utils/date-time';
import { toPersianDigits } from '@/utils/number';

export const metadata: Metadata = {
    title: 'تأیید گواهی جواهر',
    robots: { index: false, follow: false },
};

interface VerifyPageProps {
    params: Promise<{ code: string }>;
}

/** مقصد QR روی برچسب جواهر: نشان می‌دهد گواهی را کدام فروشگاه، با چه وزن و عیاری صادر کرده است */
export default async function VerifyPage({ params }: VerifyPageProps) {
    const { code } = await params;
    const cert = await getCertificate(code).catch(() => undefined);

    if (!cert) {
        return (
            <main className="container-page max-w-md py-12 text-center">
                <h1 className="text-xl font-bold">گواهی پیدا نشد</h1>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    این کد در سامانه ثبت نشده است. اگر برچسب را از فروشگاهی گرفته‌اید، با همان فروشگاه تماس بگیرید.
                </p>
                <Button asChild variant="gold" className="mt-6">
                    <Link href="/sellers">فهرست فروشندگان</Link>
                </Button>
            </main>
        );
    }

    const valid = cert.status === 'valid';
    return (
        <main className="container-page max-w-md py-10">
            <section className="bg-navy-glow rounded-2xl p-6 text-white">
                <Badge variant={valid ? 'gold' : 'secondary'}>
                    <Icon name={valid ? 'shield-check' : 'x'} />
                    {valid ? 'گواهی معتبر' : 'گواهی باطل‌شده'}
                </Badge>
                <h1 className="mt-3 text-xl font-extrabold">{cert.itemTitle}</h1>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <dt className="text-brand-200">وزن ثبت‌شده</dt>
                        <dd className="font-bold">{toPersianDigits(cert.weightGram)} گرم</dd>
                    </div>
                    <div>
                        <dt className="text-brand-200">عیار</dt>
                        <dd className="font-bold">{toPersianDigits(cert.karat)}</dd>
                    </div>
                    <div className="col-span-2">
                        <dt className="text-brand-200">صادرکننده</dt>
                        <dd className="font-bold">
                            <Link href={`/sellers/${cert.shop.slug}`} className="underline">
                                {cert.shop.name}
                            </Link>{' '}
                            · {cert.shop.city}
                            {cert.shop.verified ? ' · فروشگاه تأییدشده' : ''}
                        </dd>
                    </div>
                    <div className="col-span-2">
                        <dt className="text-brand-200">تاریخ صدور</dt>
                        <dd className="font-bold">{formatJalaliLong(cert.issuedAt)}</dd>
                    </div>
                </dl>
            </section>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">
                این گواهی گفته‌ی خودِ فروشگاه را ثبت می‌کند و جایگزین ارزیابی رسمی یا فاکتور نیست. اتصال به مرجع
                استاندارد هنوز برقرار نشده است.
            </p>
        </main>
    );
}
