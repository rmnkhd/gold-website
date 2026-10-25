'use client';

// React
import { motion } from 'framer-motion';

// Statics And Types
import { BRAND } from '@/constants/brand';

// Utils And Hooks
import { cn } from '@/lib/utils';

/** شعار برند با برق طلایی و خطِ زیرین که کشیده می‌شود */
export default function Slogan({ className }: { className?: string }) {
    return (
        <span className={cn('relative inline-block', className)}>
            <span className="text-gold-flow">{BRAND.slogan}</span>
            <svg
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-2.5 h-2.5 w-full"
            >
                <motion.path
                    d="M2 8 Q 50 1 100 6 T 198 5"
                    fill="none"
                    strokeWidth={3}
                    strokeLinecap="round"
                    className="stroke-gold-400"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, delay: 0.7, ease: 'easeInOut' }}
                />
            </svg>
        </span>
    );
}
