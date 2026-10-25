'use client';

// React
import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { Direction } from 'radix-ui';

// Components
import { TooltipProvider } from '@/components/ui/tooltip';

// Services
import { queryClient } from '@/utils/query-client';

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {/* بدون این، Radix جهت را از DOM حدس می‌زند و منو/سلکت در RTL
                گاهی از سمت اشتباه باز می‌شوند. */}
            <Direction.Provider dir="rtl">
                <MotionConfig reducedMotion="user">
                    <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
                </MotionConfig>
            </Direction.Provider>
        </QueryClientProvider>
    );
}
