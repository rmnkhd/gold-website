// React
import Link from 'next/link';

// Statics And Types
import { BRAND, PANEL_URL } from '@/constants/brand';
import { MAIN_NAV } from '@/statics/navigation';

// Components
import Logo from '@/components/layout/logo';

export default function SiteFooter() {
    return (
        <footer className="bg-navy-deep mt-16 text-brand-200">
            <div className="container-page grid gap-8 py-10 lg:grid-cols-3">
                <div>
                    <Logo tone="dark" />
                    <p className="mt-4 text-lg font-extrabold">
                        <span className="text-gold-flow">{BRAND.slogan}</span>
                    </p>
                    <p className="mt-2 max-w-xs text-sm leading-7">{BRAND.description}</p>
                </div>
                <nav aria-label="پیوندهای فوتر">
                    <h2 className="mb-3 text-sm font-semibold text-white">دسترسی سریع</h2>
                    <ul className="space-y-2 text-sm">
                        {MAIN_NAV.map((item) => (
                            <li key={item.href}>
                                <Link href={item.href} className="hover:text-gold-300">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <a href={PANEL_URL} className="hover:text-gold-300">
                                ورود طلافروشان
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="text-xs leading-6">
                    <h2 className="mb-3 text-sm font-semibold text-white">توجه</h2>
                    <p>
                        قیمت‌ها و راهنماها صرفاً جنبه‌ی اطلاع‌رسانی دارند و توصیه‌ی سرمایه‌گذاری
                        نیستند. پیش از خرید، فاکتور رسمی و شرایط بازخرید را از فروشنده بگیرید.
                    </p>
                </div>
            </div>
        </footer>
    );
}
