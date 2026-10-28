'use client';

// React
import Link from 'next/link';

// Components
import { Button } from '@/components/ui/button';

// Services
import { track } from '@/service/analytics';

/** پایان هر راهنما: مسیر به ابزار و فروشندگان؛ کلیک‌ها برای سنجش اثر محتوا ثبت می‌شوند. */
export default function GuideCta() {
    return (
        <div className="mt-6 rounded-2xl bg-brand-50 p-5">
            <p className="font-semibold">قیمت را خودتان بسنجید</p>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
                اجرت، سود و مالیات را جدا ببینید، یا قیمت یک جواهر را میان چند فروشنده مقایسه کنید.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild variant="gold">
                    <Link href="/calculator" onClick={() => track('guide_cta_click')}>
                        رفتن به محاسبه‌گر
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/sellers" onClick={() => track('guide_cta_click')}>
                        دیدن طلافروشان معتبر
                    </Link>
                </Button>
            </div>
        </div>
    );
}
