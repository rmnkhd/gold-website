'use client';

// React
import { useId } from 'react';

// Utils And Hooks
import { cn } from '@/lib/utils';

/** موج پیوسته با دوره‌ی ۶۰۰ واحد؛ دو دوره کنار هم تا حرکت `-50%` بی‌درز تکرار شود */
const WAVE_FRONT = 'M0 34 Q150 8 300 34 T600 34 T900 34 T1200 34';
const WAVE_BACK = 'M0 30 Q150 58 300 30 T600 30 T900 30 T1200 30';
const WAVE_CREST = 'M0 34 Q150 8 300 34 T600 34 T900 34 T1200 34';

/** ستاره‌ی چهارپر برای جرقه‌ی طلا */
const STAR = '[clip-path:polygon(50%_0,62%_38%,100%_50%,62%_62%,50%_100%,38%_62%,0_50%,38%_38%)]';
/** قطره‌ی اشکی‌شکل */
const DROP = 'rounded-[50%_50%_50%_50%/62%_62%_38%_38%]';

/**
 * طلای آب‌شده: استخر مایع طلایی براق با موج‌های هم‌پوشان، قطره‌ای که از لبه‌ی بالا شکل می‌گیرد،
 * می‌افتد و روی سطح حلقه می‌سازد، برق عبوری و جرقه‌های ریز.
 * فقط تزئینی (`aria-hidden`)؛ پدر باید `relative overflow-hidden` باشد و حدود `--pool` (۳ رِم)
 * فضای خالی پایین بگذارد تا متن روی مایع نیفتد. با `prefers-reduced-motion` ایستا می‌شود.
 */
export default function MoltenGold({ className }: { className?: string }) {
    const uid = useId().replace(/:/g, '');
    const frontId = `molten-front-${uid}`;
    const backId = `molten-back-${uid}`;

    return (
        <div
            aria-hidden="true"
            dir="ltr"
            className={cn(
                'pointer-events-none absolute inset-0 overflow-hidden [--pool:3.5rem] [container-type:size]',
                className
            )}
        >
            {/* قطره‌ها: دانه‌ی کشیده‌شونده روی لبه، سپس سقوط و حلقه‌ی برخورد */}
            <div className="absolute inset-y-0 start-[24%] w-6 -translate-x-1/2">
                <span
                    className={cn(
                        'animate-molten-bead absolute start-1/2 top-0 h-2 w-3 origin-top -translate-x-1/2 bg-linear-to-b from-gold-400 to-gold-200',
                        'rounded-b-full'
                    )}
                />
                <span
                    className={cn(
                        'animate-molten-drop absolute start-1/2 top-0 h-3.5 w-2.5 -translate-x-1/2 bg-linear-to-b from-gold-100 via-gold-300 to-gold-500 opacity-0',
                        DROP
                    )}
                />
                <span className="animate-molten-ripple absolute start-1/2 bottom-[calc(var(--pool)*0.66)] h-2 w-10 -translate-x-1/2 rounded-full border border-gold-100/70 opacity-0" />
            </div>
            <div className="absolute inset-y-0 start-[68%] hidden w-6 -translate-x-1/2 sm:block">
                <span
                    className={cn(
                        'animate-molten-bead absolute start-1/2 top-0 h-2 w-2.5 origin-top -translate-x-1/2 bg-linear-to-b from-gold-400 to-gold-200 [animation-delay:2.1s]',
                        'rounded-b-full'
                    )}
                />
                <span
                    className={cn(
                        'animate-molten-drop absolute start-1/2 top-0 h-3 w-2 -translate-x-1/2 bg-linear-to-b from-gold-100 via-gold-300 to-gold-500 opacity-0 [animation-delay:2.1s]',
                        DROP
                    )}
                />
                <span className="animate-molten-ripple absolute start-1/2 bottom-[calc(var(--pool)*0.66)] h-2 w-8 -translate-x-1/2 rounded-full border border-gold-100/70 opacity-0 [animation-delay:2.1s]" />
            </div>

            {/* استخر مایع */}
            <div className="animate-molten-breathe absolute inset-x-0 bottom-0 h-(--pool)">
                <svg
                    viewBox="0 0 1200 80"
                    preserveAspectRatio="none"
                    className="animate-wave-rev absolute inset-y-0 start-0 h-full w-[200%] opacity-60"
                >
                    <defs>
                        <linearGradient id={backId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" className="[stop-color:var(--gold-200)]" />
                            <stop offset="0.5" className="[stop-color:var(--gold-500)]" />
                            <stop offset="1" className="[stop-color:var(--gold-700)]" />
                        </linearGradient>
                    </defs>
                    <path d={`${WAVE_BACK} V80 H0 Z`} fill={`url(#${backId})`} />
                </svg>
                <svg
                    viewBox="0 0 1200 80"
                    preserveAspectRatio="none"
                    className="animate-wave absolute inset-y-0 start-0 h-full w-[200%]"
                >
                    <defs>
                        <linearGradient id={frontId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" className="[stop-color:var(--gold-200)]" />
                            <stop offset="0.3" className="[stop-color:var(--gold-300)]" />
                            <stop offset="0.65" className="[stop-color:var(--gold-500)]" />
                            <stop offset="1" className="[stop-color:var(--gold-700)]" />
                        </linearGradient>
                    </defs>
                    <path d={`${WAVE_FRONT} V80 H0 Z`} fill={`url(#${frontId})`} />
                    <path
                        d={WAVE_CREST}
                        fill="none"
                        className="stroke-gold-50 [vector-effect:non-scaling-stroke]"
                        strokeWidth="2"
                        strokeOpacity="0.85"
                    />
                </svg>

                <span className="animate-molten-sheen absolute inset-y-0 start-0 w-1/5 bg-linear-to-r from-transparent via-white/30 to-transparent" />

                <span
                    className={cn(
                        STAR,
                        'animate-molten-glint absolute start-[16%] top-[42%] size-3 bg-gold-50'
                    )}
                />
                <span
                    className={cn(
                        STAR,
                        'animate-molten-glint absolute start-[47%] top-[58%] size-2.5 bg-gold-50 [animation-delay:1.3s]'
                    )}
                />
                <span
                    className={cn(
                        STAR,
                        'animate-molten-glint absolute start-[78%] top-[46%] size-3.5 bg-gold-50 [animation-delay:2.4s]'
                    )}
                />
                <span
                    className={cn(
                        STAR,
                        'animate-molten-glint absolute start-[91%] top-[64%] size-2 bg-gold-50 [animation-delay:0.7s]'
                    )}
                />
            </div>
        </div>
    );
}
