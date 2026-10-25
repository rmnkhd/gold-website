'use client';

// React
import type { ComponentProps } from 'react';
import { motion } from 'framer-motion';

type RevealProps = ComponentProps<typeof motion.div> & {
    /** ثانیه */
    delay?: number;
    /** جابه‌جایی اولیه (پیکسل) */
    y?: number;
};

/** وقتی وارد دید شد، یک‌بار نرم بالا می‌آید و ظاهر می‌شود (`MotionConfig` حرکت کاهش‌یافته را رعایت می‌کند) */
export default function Reveal({ delay = 0, y = 22, children, ...props }: RevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
