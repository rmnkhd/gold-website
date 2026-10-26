/** سقف ایمنی شماره‌ی صفحه (offset بی‌نهایت به بک‌اند نرود) */
const MAX_PAGE = 500;

/** `?page=` را به عدد صحیح ≥ ۱ تبدیل می‌کند؛ نامعتبر = صفحه‌ی اول */
export const parsePage = (raw: string | undefined): number => {
    if (!raw || !/^\d+$/.test(raw)) return 1;
    return Math.min(MAX_PAGE, Math.max(1, Number(raw)));
};

export const pageCount = (total: number, pageSize: number): number => Math.max(1, Math.ceil(total / pageSize));

/** نشانی یک صفحه با حفظ فیلترها؛ صفحه‌ی اول `page` ندارد تا نشانی تکراری ایندکس نشود */
export const pageHref = (base: string, page: number, filters: Record<string, string | undefined>): string => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
        if (value) params.set(key, value);
    }
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
};
