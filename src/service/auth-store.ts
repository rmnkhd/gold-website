/**
 * نشست سایت مردم: ورود/ثبت‌نام یک جریان است (موبایل + کد ۶ رقمی؛ شماره‌ی تازه نام هم می‌دهد).
 *
 * - توکن دسترسی ۱۵ دقیقه‌ای و refresh چرخشی در localStorage؛ استفاده‌ی دوباره‌ی refresh قدیمی همه‌ی
 *   نشست‌های آن مشتری را باطل می‌کند.
 * - تا وصل شدن پیامک، سرور `devCode` را برمی‌گرداند و UI نشانش می‌دهد (vault: شبیه‌سازی‌ها #1).
 */

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8090').replace(/\/$/, '');
const STORAGE_KEY = 'zarineh-front-session-v2';

export interface Session {
    id: string;
    name: string;
    phone: string;
}

interface Stored extends Session {
    accessToken: string;
    refreshToken: string;
    /** ms — کمی زودتر از انقضای واقعی */
    expiresAt: number;
}

export interface OtpResult {
    expiresIn: number;
    resendIn: number;
    isNewUser: boolean;
    devCode?: string;
}

interface SessionPayload {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    consumer: Session;
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const subscribeSession = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const readStored = (): Stored | null => {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Stored) : null;
    } catch {
        return null;
    }
};

const writeStored = (value: Stored | null): void => {
    try {
        if (value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ذخیره‌ی ناموفق = نشست پایدار نمی‌ماند
    }
};

let cachedRaw: string | null | undefined;
let cachedSession: Session | null = null;

/** برای useSyncExternalStore: مرجع پایدار تا وقتی داده عوض نشده */
export const getSessionSnapshot = (): Session | null => {
    let raw: string | null = null;
    try {
        raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
        raw = null;
    }
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        try {
            const s = raw ? (JSON.parse(raw) as Stored) : null;
            cachedSession = s ? { id: s.id, name: s.name, phone: s.phone } : null;
        } catch {
            cachedSession = null;
        }
    }
    return cachedSession;
};

export const getAccessToken = (): string | null => readStored()?.accessToken ?? null;

const fromPayload = (p: SessionPayload): Stored => ({
    id: p.consumer.id,
    name: p.consumer.name,
    phone: p.consumer.phone,
    accessToken: p.accessToken,
    refreshToken: p.refreshToken,
    expiresAt: Date.now() + p.expiresIn * 1000 - 15_000,
});

async function post<T>(path: string, body: unknown): Promise<T> {
    let res: Response;
    try {
        res = await fetch(API_URL + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch {
        throw new Error('ارتباط با سرور برقرار نشد؛ اینترنت یا سرور را بررسی کنید');
    }
    if (res.status === 204) return undefined as T;
    const json = (await res.json().catch(() => ({}))) as {
        data?: T;
        error?: { code?: string; message?: string };
    };
    if (!res.ok) {
        const err = new Error(json.error?.message ?? 'خطای ناشناخته') as Error & { code?: string };
        err.code = json.error?.code;
        throw err;
    }
    return json.data as T;
}

export const isValidPhone = (phone: string): boolean => /^09\d{9}$/.test(phone);

/** درخواست کد؛ پاسخ می‌گوید شماره حساب دارد یا نه */
export const requestOtp = (phone: string): Promise<OtpResult> =>
    post<OtpResult>('/v1/auth/otp', { realm: 'consumer', purpose: 'login', phone });

/** ورود؛ اگر حساب نبود با `name` حساب می‌سازد */
export async function loginOrRegister(phone: string, code: string, name?: string): Promise<Session> {
    const stored = fromPayload(
        await post<SessionPayload>('/v1/auth/consumer/login', { phone, code, name: name?.trim() || undefined })
    );
    writeStored(stored);
    emit();
    return getSessionSnapshot() as Session;
}

/** پس از ویرایش نام در «حساب من» نشست محلی هم به‌روز می‌شود */
export function setSessionName(name: string): void {
    const current = readStored();
    if (!current) return;
    writeStored({ ...current, name });
    emit();
}

let refreshing: Promise<boolean> | null = null;

/** نوسازی نشست؛ هم‌زمان فقط یک درخواست (refresh چرخشی است) */
export function refreshSession(): Promise<boolean> {
    if (refreshing) return refreshing;
    refreshing = (async () => {
        const current = readStored();
        if (!current) return false;
        try {
            const next = fromPayload(
                await post<SessionPayload>('/v1/auth/refresh', { refreshToken: current.refreshToken })
            );
            writeStored(next);
            emit();
            return true;
        } catch {
            writeStored(null);
            emit();
            return false;
        } finally {
            refreshing = null;
        }
    })();
    return refreshing;
}

export async function logout(): Promise<void> {
    const current = readStored();
    writeStored(null);
    emit();
    if (current) {
        try {
            await post('/v1/auth/logout', { refreshToken: current.refreshToken });
        } catch {
            // خروج محلی انجام شده؛ باطل‌سازی سمت سرور بی‌صدا شکست خورد
        }
    }
}
