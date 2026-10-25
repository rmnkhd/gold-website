'use client';

// React
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Services
import { marketPricesOptions } from '@/service/api/market';

// Utils And Hooks
import { describePrice, type PriceStatus } from '@/lib/price-status';

/**
 * قیمت بازار با تازه‌سازی خودکار و وضعیت صادقانه (زنده / کهنه / نمونه / آفلاین).
 * `tickMs` فاصله‌ی به‌روزشدن «X ثانیه پیش» است.
 */
export function useMarketPrices(tickMs = 1000) {
    const query = useQuery(marketPricesOptions);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), tickMs);
        return () => clearInterval(id);
    }, [tickMs]);

    const prices = query.data?.data;
    const offline = typeof navigator !== 'undefined' && !navigator.onLine;
    const status: PriceStatus | null = prices
        ? describePrice(prices, {
              elapsedSeconds: query.dataUpdatedAt
                  ? Math.max(0, (now - query.dataUpdatedAt) / 1000)
                  : 0,
              failed: query.isRefetchError || offline,
          })
        : null;

    return { prices, status, isLoading: query.isLoading, isError: query.isError };
}
