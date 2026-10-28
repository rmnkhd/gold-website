/** پیوند ورود که پس از ورود به همین صفحه برمی‌گردد؛ خودِ صفحه‌ی ورود به خودش `next` نمی‌گیرد. */
export const loginHref = (pathname: string): string => {
    const path = pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '/login') return '/login';
    return `/login?next=${encodeURIComponent(pathname)}`;
};
