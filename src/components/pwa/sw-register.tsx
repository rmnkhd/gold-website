'use client';

// React
import { useEffect } from 'react';

/** ثبت service worker فقط در production تا dev کش نشود */
export default function SwRegister() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') return;
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // ثبت نشدن SW نباید تجربه را خراب کند
        });
    }, []);

    return null;
}
