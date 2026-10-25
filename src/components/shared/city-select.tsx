'use client';

// React
import { useEffect, useId, useMemo, useRef, useState } from 'react';

// Statics And Types
import type { IranCity } from '@/statics/iran-cities';

// Components
import { Icon } from '@/components/icon';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Utils And Hooks
import { searchCities } from '@/lib/city-search';
import { cn } from '@/lib/utils';

interface CitySelectProps {
    /** نام شهر؛ مقدار آزادِ قدیمی که در فهرست نیست هم نمایش داده می‌شود */
    value: string;
    onChange: (city: string, meta?: IranCity) => void;
    /** گزینه‌ی «همه‌ی شهرها» (مقدار خالی) — برای فیلترها */
    allowAll?: boolean;
    /** اگر داده شود یک `input[type=hidden]` می‌سازد تا فرم GET معمولی هم کار کند */
    name?: string;
    id?: string;
    placeholder?: string;
    className?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
    'aria-describedby'?: string;
    disabled?: boolean;
}

/** انتخابگر شهر: انتخابی ولی جست‌وجوپذیر؛ کیبورد: ↑↓ حرکت، Enter انتخاب، Esc بستن */
export default function CitySelect({
    value,
    onChange,
    allowAll = false,
    name,
    id,
    placeholder = 'انتخاب شهر',
    className,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    disabled,
}: CitySelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const listId = useId();
    const listRef = useRef<HTMLUListElement>(null);

    const options = useMemo(() => searchCities(query), [query]);
    const hasAll = allowAll && query.trim() === '';
    const total = options.length + (hasAll ? 1 : 0);

    useEffect(() => {
        listRef.current
            ?.querySelector('[data-active="true"]')
            ?.scrollIntoView({ block: 'nearest' });
    }, [active, open]);

    const choose = (index: number) => {
        if (hasAll && index === 0) {
            onChange('');
        } else {
            const city = options[index - (hasAll ? 1 : 0)];
            if (!city) return;
            onChange(city.name, city);
        }
        setOpen(false);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActive((i) => Math.min(i + 1, total - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (total > 0) choose(active);
        }
    };

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (next) setQuery('');
            }}
        >
            {name ? <input type="hidden" name={name} value={value} /> : null}
            <PopoverTrigger asChild>
                <button
                    type="button"
                    id={id}
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-invalid={ariaInvalid}
                    aria-describedby={ariaDescribedBy}
                    disabled={disabled}
                    className={cn(
                        'flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-start text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/30',
                        className
                    )}
                >
                    <span className={cn('truncate', !value && 'text-muted-foreground')}>
                        {value || (allowAll ? 'همه‌ی شهرها' : placeholder)}
                    </span>
                    <Icon name="chevron-down" className="size-4 shrink-0 text-muted-foreground" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) min-w-56 p-2"
            >
                <div className="relative">
                    <Icon
                        name="search"
                        className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        autoFocus
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setActive(0);
                        }}
                        onKeyDown={onKeyDown}
                        placeholder="جست‌وجوی شهر یا استان"
                        aria-label="جست‌وجوی شهر"
                        aria-controls={listId}
                        aria-activedescendant={total > 0 ? `${listId}-${active}` : undefined}
                        className="ps-8"
                    />
                </div>
                <ul
                    id={listId}
                    ref={listRef}
                    role="listbox"
                    className="mt-2 max-h-56 overflow-y-auto"
                >
                    {hasAll ? (
                        <Option
                            id={`${listId}-0`}
                            label="همه‌ی شهرها"
                            selected={value === ''}
                            active={active === 0}
                            onPick={() => choose(0)}
                            onHover={() => setActive(0)}
                        />
                    ) : null}
                    {options.map((city, i) => {
                        const index = i + (hasAll ? 1 : 0);
                        return (
                            <Option
                                key={city.name}
                                id={`${listId}-${index}`}
                                label={city.name}
                                hint={city.province !== city.name ? city.province : undefined}
                                selected={city.name === value}
                                active={active === index}
                                onPick={() => choose(index)}
                                onHover={() => setActive(index)}
                            />
                        );
                    })}
                    {total === 0 ? (
                        <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                            شهری پیدا نشد.
                        </li>
                    ) : null}
                </ul>
            </PopoverContent>
        </Popover>
    );
}

interface OptionProps {
    id: string;
    label: string;
    hint?: string;
    selected: boolean;
    active: boolean;
    onPick: () => void;
    onHover: () => void;
}

function Option({ id, label, hint, selected, active, onPick, onHover }: OptionProps) {
    return (
        <li
            id={id}
            role="option"
            aria-selected={selected}
            data-active={active}
            onClick={onPick}
            onMouseEnter={onHover}
            className={cn(
                'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm',
                active && 'bg-accent text-accent-foreground',
                selected && 'font-semibold'
            )}
        >
            <span className="truncate">{label}</span>
            <span className="flex items-center gap-2">
                {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
                {selected ? <Icon name="check" className="size-4 text-gold-600" /> : null}
            </span>
        </li>
    );
}
