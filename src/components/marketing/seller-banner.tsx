// Components
import { SellerCtaLink } from '@/components/analytics/tracked-link';
import { Button } from '@/components/ui/button';

// Statics And Types
import { PANEL_URL } from '@/constants/brand';

/** دعوت طلافروش به پنل؛ کلیک با UTM صفحه‌ی مبدأ ثبت می‌شود تا قیف جذب فروشنده قابل‌اندازه‌گیری باشد. */
export default function SellerBanner({ className }: { className?: string }) {
    return (
        <aside className={`bg-navy-glow rounded-2xl p-5 text-white ${className ?? ''}`} aria-label="دعوت طلافروشان">
            <p className="text-lg font-extrabold">طلافروش هستید؟</p>
            <p className="mt-1 max-w-xl text-sm leading-7 text-brand-100">
                پنل مدیریت فروشگاه: فاکتور، موجودی وزنی، دفتر بدهی و طلب مشتریان و یادآوری مناسبت‌ها — و صفحه‌ی اختصاصی فروشگاه شما در
                زرینه. ماه اول رایگان است.
            </p>
            <Button asChild variant="gold" className="mt-4">
                <SellerCtaLink panelUrl={PANEL_URL}>ثبت‌نام فروشگاه</SellerCtaLink>
            </Button>
        </aside>
    );
}
