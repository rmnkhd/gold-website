const BASE_TOAST =
    '!font-sans !rounded-2xl !border !border-border !bg-card !text-card-foreground !shadow-xl !gap-3 !px-4 !py-3.5 !items-center ' +
    '[&_[data-content]]:!font-sans [&_[data-content]]:!gap-0.5 ' +
    '[&_[data-title]]:!text-sm [&_[data-title]]:!font-semibold [&_[data-title]]:!leading-6 [&_[data-title]]:!text-card-foreground ' +
    '[&_[data-description]]:!text-xs [&_[data-description]]:!leading-5 [&_[data-description]]:!text-muted-foreground ' +
    '[&_[data-icon]]:!m-0 [&_[data-icon]]:!size-8 [&_[data-icon]]:!shrink-0 [&_[data-icon]]:!items-center [&_[data-icon]]:!justify-center [&_[data-icon]]:!rounded-full [&_[data-icon]]:!text-white [&_[data-icon]_svg]:!size-[18px] ' +
    '[&_[data-close-button]]:!border-border [&_[data-close-button]]:!bg-card [&_[data-close-button]]:!text-muted-foreground [&_[data-close-button]:hover]:!bg-muted';

export const TOAST_CLASS_NAMES = {
    toast: BASE_TOAST,
    info: '[&_[data-icon]]:!bg-brand-500',
    error: '!border-danger-500/25 [&_[data-icon]]:!bg-danger-500',
    success: '!border-success-500/25 [&_[data-icon]]:!bg-success-500',
    warning: '!border-warning-500/25 [&_[data-icon]]:!bg-warning-500',
} as const;
