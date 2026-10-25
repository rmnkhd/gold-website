'use client';

// React
import { useState, type ComponentProps } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// Components
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Utils And Hooks
import { cn } from '@/lib/utils';
import {
    buildMonthGrid,
    formatJalaliLong,
    formatJalaliMonth,
    shiftJalaliMonth,
    todayJalali,
    WEEKDAYS_SHORT,
} from '@/utils/date-time';
import { isoToJalali, jalaliToIso, jalaliToJdn, type JalaliDate } from '@/utils/jalali-calendar';
import { toPersianDigits } from '@/utils/number';

const pad = (n: number): string => String(n).padStart(2, '0');

const sameDay = (a: JalaliDate, b: JalaliDate): boolean =>
    a.year === b.year && a.month === b.month && a.day === b.day;

export { jalaliToIso };

interface JalaliDatePickerProps
    extends Omit<ComponentProps<'button'>, 'value' | 'onChange' | 'type'> {
    /** `YYYY-MM-DD` میلادی یا رشته‌ی خالی */
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    /** کمترین/بیشترین روز قابل‌انتخاب، `YYYY-MM-DD` */
    min?: string;
    max?: string;
    /** نمایش دکمه‌ی «پاک کردن» */
    clearable?: boolean;
}

/**
 * تقویم شمسی برای فرم‌ها: مقدار ذخیره‌شده همان `YYYY-MM-DD` میلادی است (مثل `input[type=date]`)
 * ولی کاربر شمسی می‌بیند و انتخاب می‌کند. برای فیلد RHF: `<JalaliDatePicker {...field} />`.
 */
export default function JalaliDatePicker({
    value,
    onChange,
    placeholder = 'انتخاب تاریخ',
    min,
    max,
    clearable = true,
    className,
    disabled,
    ...props
}: JalaliDatePickerProps) {
    const reduce = useReducedMotion();
    const selected = isoToJalali(value);
    const minDate = min ? isoToJalali(min) : undefined;
    const maxDate = max ? isoToJalali(max) : undefined;
    const today = todayJalali();
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<JalaliDate>(selected ?? today);
    const [direction, setDirection] = useState(1);

    const jdn = (d: JalaliDate): number => jalaliToJdn(d.year, d.month, d.day);
    const blocked = (d: JalaliDate): boolean =>
        (minDate !== undefined && jdn(d) < jdn(minDate)) || (maxDate !== undefined && jdn(d) > jdn(maxDate));

    const go = (delta: number) => {
        setDirection(delta);
        setMonth((m) => shiftJalaliMonth(m, delta));
    };

    const pick = (d: JalaliDate) => {
        if (blocked(d)) return;
        onChange(jalaliToIso(d));
        setOpen(false);
    };

    const cells = buildMonthGrid(month);

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                if (next) setMonth(selected ?? today);
                setOpen(next);
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30',
                        !selected && 'text-muted-foreground',
                        className
                    )}
                    {...props}
                >
                    <span>{selected ? formatJalaliLong(jalaliToIso(selected) + 'T12:00:00') : placeholder}</span>
                    <Icon name="calendar" className="size-4 text-muted-foreground" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[19rem] p-3">
                <div className="mb-2 flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="ماه بعد"
                        onClick={() => go(1)}
                    >
                        <Icon name="chevron-left" className="size-4" />
                    </Button>
                    <span className="text-sm font-semibold">{formatJalaliMonth(month)}</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="ماه قبل"
                        onClick={() => go(-1)}
                    >
                        <Icon name="chevron-left" className="size-4 rotate-180" />
                    </Button>
                </div>

                <div className="mb-1 grid grid-cols-7 text-center text-[11px] text-muted-foreground">
                    {WEEKDAYS_SHORT.map((d) => (
                        <span key={d} className="py-1">
                            {d}
                        </span>
                    ))}
                </div>

                <div className="relative overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.div
                            key={`${month.year}-${month.month}`}
                            className="grid grid-cols-7 gap-y-1"
                            initial={reduce ? false : { opacity: 0, x: direction * 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={reduce ? undefined : { opacity: 0, x: direction * -24 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                        >
                            {cells.map(({ date, isOutside, isToday }) => {
                                const isSelected = selected !== undefined && sameDay(date, selected);
                                const isBlocked = blocked(date);
                                return (
                                    <button
                                        key={`${date.year}-${date.month}-${date.day}`}
                                        type="button"
                                        disabled={isBlocked}
                                        aria-label={formatJalaliLong(jalaliToIso(date) + 'T12:00:00')}
                                        aria-pressed={isSelected}
                                        onClick={() => pick(date)}
                                        className={cn(
                                            'mx-auto flex size-9 items-center justify-center rounded-full text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                            isOutside && 'text-muted-foreground/50',
                                            isToday && !isSelected && 'ring-1 ring-gold-400',
                                            isSelected
                                                ? 'bg-gold-sheen font-bold text-brand-950'
                                                : 'hover:bg-accent',
                                            isBlocked && 'pointer-events-none opacity-30'
                                        )}
                                    >
                                        {toPersianDigits(date.day)}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-2 flex items-center justify-between border-t pt-2">
                    <Button type="button" variant="ghost" size="xs" onClick={() => pick(today)} disabled={blocked(today)}>
                        امروز
                    </Button>
                    {clearable && value ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                                onChange('');
                                setOpen(false);
                            }}
                        >
                            پاک کردن
                        </Button>
                    ) : null}
                </div>
            </PopoverContent>
        </Popover>
    );
}

const TIMES = Array.from({ length: 24 }, (_, i) => `${pad(9 + Math.floor(i / 2))}:${i % 2 ? '30' : '00'}`);

interface JalaliDateTimePickerProps {
    /** `YYYY-MM-DDTHH:mm` (محلی) یا خالی */
    value: string;
    onChange: (value: string) => void;
    min?: string;
}

/** تاریخ شمسی + ساعت (بازه‌ی نیم‌ساعته‌ی ۹ تا ۲۰:۳۰)؛ خروجی `YYYY-MM-DDTHH:mm` */
export function JalaliDateTimePicker({ value, onChange, min }: JalaliDateTimePickerProps) {
    const [date, time = ''] = value.split('T');
    return (
        <div className="grid grid-cols-[1fr_7rem] gap-3">
            <JalaliDatePicker
                value={date ?? ''}
                min={min}
                clearable={false}
                onChange={(d) => onChange(d ? `${d}T${time || '10:00'}` : '')}
            />
            <Select value={time} onValueChange={(t) => date && onChange(`${date}T${t}`)} disabled={!date}>
                <SelectTrigger className="w-full" aria-label="ساعت">
                    <SelectValue placeholder="ساعت" />
                </SelectTrigger>
                <SelectContent>
                    {TIMES.map((t) => (
                        <SelectItem key={t} value={t}>
                            {toPersianDigits(t)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
