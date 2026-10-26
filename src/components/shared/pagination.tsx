// React
import Link from 'next/link';

// Components
import { Icon } from '@/components/icon';

// Utils And Hooks
import { pageHref } from '@/lib/pagination';
import { toPersianDigits } from '@/utils/number';

interface PaginationProps {
    base: string;
    page: number;
    pages: number;
    filters?: Record<string, string | undefined>;
}

const linkClass =
    'inline-flex h-9 items-center gap-1 rounded-lg border bg-card px-3 text-sm transition-colors hover:border-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500';

/** صفحه‌بندی با پیوند واقعی (خزیدنی برای موتور جستجو)؛ در RTL «بعدی» سمت چپ است */
export default function Pagination({ base, page, pages, filters = {} }: PaginationProps) {
    if (pages <= 1) return null;
    return (
        <nav aria-label="صفحه‌بندی" className="mt-8 flex items-center justify-between gap-3">
            {page > 1 ? (
                <Link href={pageHref(base, page - 1, filters)} rel="prev" className={linkClass}>
                    قبلی
                </Link>
            ) : (
                <span />
            )}
            <span className="text-sm text-muted-foreground">
                صفحه‌ی {toPersianDigits(page)} از {toPersianDigits(pages)}
            </span>
            {page < pages ? (
                <Link href={pageHref(base, page + 1, filters)} rel="next" className={linkClass}>
                    بعدی
                    <Icon name="chevron-left" className="size-4" />
                </Link>
            ) : (
                <span />
            )}
        </nav>
    );
}
