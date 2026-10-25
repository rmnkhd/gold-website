'use client';

// React
import { useSyncExternalStore } from 'react';

// Services
import { getSessionSnapshot, subscribeSession, type Session } from '@/service/auth-store';

const subscribe = (listener: () => void) => subscribeSession(listener);
const getServerSnapshot = (): Session | null => null;

/** `ready` تا وقتی مرورگر نشست را نخوانده false است (SSR همیشه false) */
export function useSession(): { session: Session | null; ready: boolean } {
    const session = useSyncExternalStore(subscribe, getSessionSnapshot, getServerSnapshot);
    const ready = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
    return { session, ready };
}
