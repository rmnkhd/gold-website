/**
 * قرارداد مشترک جلوگیری از سرریز افقی در پنل.
 *
 * این کلاس‌ها عمداً متمرکزند تا پوسته، هدر صفحه و محتوای عریض در صفحات
 * جدید هم همان رفتار واکنش‌گرا را به ارث ببرند.
 */
export function panelMainClassName() {
    return 'min-w-0 max-w-full flex-1 p-4 lg:p-6';
}

export function pageRootClassName() {
    return 'flex min-w-0 w-full max-w-full flex-col gap-5';
}

export function pageActionsClassName() {
    return 'flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0';
}

export function scrollableRowClassName() {
    // overflow-x-auto به‌تنهایی کافی نیست: طبق مشخصات CSS اگر یک محور
    // auto باشد و دیگری visible بماند، مرورگر overflow-y را هم auto
    // حساب می‌کند. با اختلاف زیرپیکسلیِ ارتفاع (مثلاً تب‌ها) همین باعث
    // یک اسکرول عمودیِ شبح می‌شود که ربطی به سرریز افقیِ موردنظر ندارد.
    return 'max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain';
}

export function tableContainerClassName() {
    return `relative w-full ${scrollableRowClassName()}`;
}

export function visuallyHiddenInputGuardClassName() {
    return '[&.sr-only]:!size-px [&.sr-only]:!min-w-px';
}
