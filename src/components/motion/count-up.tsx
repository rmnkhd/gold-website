'use client';

// React
import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

interface CountUpProps {
    value: number;
    /** قالب نمایش؛ پیش‌فرض عدد گردشده */
    format?: (n: number) => string;
    duration?: number;
    className?: string;
}

/** عدد با شمارش نرم تا مقدار نهایی (هر بار که value عوض شد از مقدار قبلی ادامه می‌دهد) */
export default function CountUp({
    value,
    format = (n) => String(Math.round(n)),
    duration = 0.9,
    className,
}: CountUpProps) {
    const reduce = useReducedMotion();
    const [display, setDisplay] = useState(0);
    const from = useRef(0);

    useEffect(() => {
        if (reduce) return;
        const controls = animate(from.current, value, {
            duration,
            ease: 'easeOut',
            onUpdate: (n) => {
                from.current = n;
                setDisplay(n);
            },
        });
        return () => controls.stop();
    }, [value, duration, reduce]);

    return <span className={className}>{format(reduce ? value : display)}</span>;
}
