// React
import { useSyncExternalStore } from 'react';

/**
 * نتیجه‌ی یک media query؛ روی سرور (و اولین رندر) `false` است تا hydration
 * ناهمخوان نشود. برای انتخاب بین دو رفتار کاملاً متفاوت (مثلاً پنجره‌ی
 * شناور در دسکتاپ و کشوی پایین در موبایل) کاربرد دارد.
 */
export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        (onChange) => {
            const list = window.matchMedia(query);
            list.addEventListener('change', onChange);
            return () => list.removeEventListener('change', onChange);
        },
        () => window.matchMedia(query).matches,
        () => false
    );
}
