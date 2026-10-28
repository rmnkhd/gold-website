'use client';

// React
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Services
import { trackPageview } from '@/service/analytics';

/**
 * بازدید هر صفحه را (بدون کوکی) ثبت می‌کند. ارجاع‌دهنده فقط برای اولین بازدید نشست است؛
 * در جابه‌جایی‌های داخلی ارجاع همان سایت است و چیزی اضافه نمی‌کند.
 */
export default function Tracker() {
    const pathname = usePathname();
    const first = useRef(true);
    /** آخرین مسیر ثبت‌شده؛ اجرای دوباره‌ی افکت (StrictMode در dev) بازدید را دوبار نمی‌شمارد */
    const last = useRef('');

    useEffect(() => {
        if (last.current === pathname) return;
        last.current = pathname;
        trackPageview(pathname, first.current ? document.referrer : undefined);
        first.current = false;
    }, [pathname]);

    return null;
}
