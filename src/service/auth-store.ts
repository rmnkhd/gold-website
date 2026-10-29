/**
 * نشست سایت مردم: ورود/ثبت‌نام یک جریان است (موبایل + کد ۶ رقمی؛ شماره‌ی تازه نام هم می‌دهد).
 *
 * - توکن دسترسی ۱۵ دقیقه‌ای فقط در حافظه‌ی تب است و refresh چرخشی در کوکی httpOnly که جاوااسکریپت (و XSS)
 *   نمی‌تواند بخواند؛ در localStorage فقط پروفایل نمایشی می‌ماند. استفاده‌ی دوباره‌ی refresh قدیمی همه‌ی نشست‌های
 *   آن مشتری را باطل می‌کند.
 * - نوسازی بین تب‌ها قفل مشترک دارد و فقط رد قطعی سرور نشست را پاک می‌کند → `refresh.ts`.
 * - تا وصل شدن پیامک، سرور `devCode` را برمی‌گرداند و UI نشانش می‌دهد (vault: شبیه‌سازی‌ها #1).
 */

// Services
import { createRefresher, RefreshRejected, webLock } from '@/service/refresh';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8090').replace(/\/$/, '');
const STORAGE_KEY = 'zarineh-front-session-v3';
/** کلید قدیمی که توکن‌ها را در localStorage نگه می‌داشت؛ هر بار پاک می‌شود */
const LEGACY_KEY = 'zarineh-front-session-v2';
const REALM = 'consumer';

export interface Session {
    id: string;
    name: string;
    phone: string;
}

export interface OtpResult {
    expiresIn: number;
    resendIn: number;
    isNewUser: boolean;
    devCode?: string;
}

interface SessionPayload {
    accessToken: string;
    expiresIn: number;
    consumer: Session;
}

/** توکن دسترسی فقط در حافظه‌ی همین تب */
let memory: { accessToken: string; expiresAt: number } | null = null;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const subscribeSession = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const readProfile = (): Session | null => {
    try {
        window.localStorage.removeItem(LEGACY_KEY);
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
        return null;
    }
};

const writeProfile = (value: Session | null): void => {
    try {
        if (value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ذخیره‌ی ناموفق = نشست بعد از بستن تب نمی‌ماند
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
            cachedSession = raw ? (JSON.parse(raw) as Session) : null;
        } catch {
            cachedSession = null;
        }
    }
    return cachedSession;
};

/** توکن دسترسی معتبر (در حافظه)؛ بعد از ریلود تب تا نوسازی null است */
export const getAccessToken = (): string | null => (memory && memory.expiresAt > Date.now() ? memory.accessToken : null);

const applyPayload = (p: SessionPayload): void => {
    memory = { accessToken: p.accessToken, expiresAt: Date.now() + p.expiresIn * 1000 - 15_000 };
    writeProfile({ id: p.consumer.id, name: p.consumer.name, phone: p.consumer.phone });
    emit();
};

const dropSession = (): void => {
    memory = null;
    writeProfile(null);
    emit();
};

class ApiMessageError extends Error {
    code?: string;
    status: number;
    constructor(message: string, status: number, code?: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}

/** POST به مسیرهای احراز هویت؛ کوکی نوسازی (httpOnly) فقط روی /v1/auth می‌رود و X-Client دفاع CSRF است */
async function post<T>(path: string, body: unknown): Promise<T> {
    let res: Response;
    try {
        res = await fetch(API_URL + path, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-Client': 'web' },
            body: JSON.stringify(body),
        });
    } catch {
        throw new ApiMessageError('ارتباط با سرور برقرار نشد؛ اینترنت یا سرور را بررسی کنید', 0);
    }
    if (res.status === 204) return undefined as T;
    const json = (await res.json().catch(() => ({}))) as {
        data?: T;
        error?: { code?: string; message?: string };
    };
    if (!res.ok) throw new ApiMessageError(json.error?.message ?? 'خطای ناشناخته', res.status, json.error?.code);
    return json.data as T;
}

export const isValidPhone = (phone: string): boolean => /^09\d{9}$/.test(phone);

/** درخواست کد؛ پاسخ می‌گوید شماره حساب دارد یا نه */
export const requestOtp = (phone: string): Promise<OtpResult> =>
    post<OtpResult>('/v1/auth/otp', { realm: REALM, purpose: 'login', phone });

/** ورود؛ اگر حساب نبود با `name` حساب می‌سازد */
export async function loginOrRegister(phone: string, code: string, name?: string): Promise<Session> {
    applyPayload(await post<SessionPayload>('/v1/auth/consumer/login', { phone, code, name: name?.trim() || undefined }));
    return getSessionSnapshot() as Session;
}

/** پس از ویرایش نام در «حساب من» نشست محلی هم به‌روز می‌شود */
export function setSessionName(name: string): void {
    const current = readProfile();
    if (!current) return;
    writeProfile({ ...current, name });
    emit();
}

/** نوسازی نشست؛ هم‌زمان (حتی بین تب‌ها) فقط یک درخواست، و فقط رد قطعی سرور نشست را پاک می‌کند */
export const refreshSession = createRefresher<SessionPayload>({
    marker: () => memory?.accessToken ?? null,
    call: async () => {
        try {
            return await post<SessionPayload>('/v1/auth/refresh', { realm: REALM });
        } catch (e) {
            if (e instanceof ApiMessageError && (e.status === 401 || e.status === 403)) throw new RefreshRejected(e.status);
            throw e;
        }
    },
    apply: applyPayload,
    clear: dropSession,
    withLock: (fn) => webLock('zarineh-front-refresh', fn),
});

/** توکن دسترسی آماده؛ اگر منقضی/پس از ریلود خالی است و کاربر وارد شده، با کوکی نو می‌شود */
export async function ensureAccessToken(): Promise<string | null> {
    const token = getAccessToken();
    if (token) return token;
    if (!readProfile()) return null;
    await refreshSession();
    return getAccessToken();
}

export async function logout(): Promise<void> {
    const had = readProfile();
    dropSession();
    if (had) {
        try {
            await post('/v1/auth/logout', { realm: REALM });
        } catch {
            // خروج محلی انجام شده؛ باطل‌سازی سمت سرور بی‌صدا شکست خورد
        }
    }
}
