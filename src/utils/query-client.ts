// Services
import { QueryClient } from '@tanstack/react-query';

/**
 * یک نمونه‌ی مشترک برای کل اپ.
 * داده‌ها فعلاً از `mockRequest` می‌آیند، ولی چیدمان کوئری‌ها همان چیزی است که
 * با بک‌اند واقعی هم کار می‌کند.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 60 * 1000,
        },
    },
});
