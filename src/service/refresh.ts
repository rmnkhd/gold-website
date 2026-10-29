/**
 * منطق نوسازی نشست، بدون وابستگی به مرورگر (قابل تست).
 *
 * - هم‌زمان فقط یک نوسازی در حال اجراست (درون تب) و بین تب‌ها قفل مشترک (Web Locks) می‌گیرد: refresh چرخشی است و
 *   دو درخواست هم‌زمان با یک توکن را سرور «سرقت» می‌داند و همه‌ی نشست‌های کاربر را باطل می‌کند.
 * - فقط رد قطعی سرور (۴۰۱/۴۰۳) نشست را پاک می‌کند. قطعی شبکه یا خطای موقت سرور (۵xx) نشست را نگه می‌دارد تا
 *   کاربر با اینترنت ناپایدار بیرون انداخته نشود.
 */

/** سرور نوسازی را قطعی رد کرد (نشست باطل/منقضی) */
export class RefreshRejected extends Error {
    status: number;
    constructor(status: number) {
        super('refresh rejected');
        this.name = 'RefreshRejected';
        this.status = status;
    }
}

export interface RefreshDeps<S> {
    /** نشانه‌ی نشست فعلی (مثلاً توکن دسترسی)؛ اگر در انتظار قفل عوض شد، تب دیگری نوسازی کرده است */
    marker(): string | null;
    /** درخواست نوسازی؛ رد قطعی → RefreshRejected، هر خطای دیگر = موقت */
    call(): Promise<S>;
    apply(session: S): void;
    clear(): void;
    /** قفل بین تب‌ها؛ بدون Web Locks همان fn */
    withLock<T>(fn: () => Promise<T>): Promise<T>;
}

export function createRefresher<S>(deps: RefreshDeps<S>): () => Promise<boolean> {
    let inflight: Promise<boolean> | null = null;
    return function refresh(): Promise<boolean> {
        if (inflight) return inflight;
        const before = deps.marker();
        inflight = deps
            .withLock(async () => {
                const now = deps.marker();
                // تب دیگری در فاصله‌ی انتظار قفل نشست را نو کرده → نیازی به درخواست دوباره نیست
                if (before !== null && now !== null && now !== before) return true;
                try {
                    deps.apply(await deps.call());
                    return true;
                } catch (e) {
                    if (e instanceof RefreshRejected) deps.clear();
                    return false;
                }
            })
            .finally(() => {
                inflight = null;
            });
        return inflight;
    };
}

/** قفل بین تب‌ها با Web Locks؛ در محیط بدون پشتیبانی (قدیمی/SSR) بدون قفل اجرا می‌شود */
export function webLock<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const locks = (globalThis as { navigator?: { locks?: { request: (n: string, cb: () => Promise<T>) => Promise<T> } } }).navigator?.locks;
    return locks ? locks.request(name, fn) : fn();
}
