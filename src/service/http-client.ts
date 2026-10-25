// Statics And Types
import type { GenericResponse } from '@/dto/common';

// Services
import { getAccessToken, refreshSession } from '@/service/auth-store';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8090').replace(/\/$/, '');

export class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface Options {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    query?: Query;
    /** false = بدون توکن (ورود/ثبت‌نام/عمومی) */
    auth?: boolean;
    /** ثانیه؛ فقط سمت سرور (صفحه‌های سئو) کش ISR می‌شود */
    revalidate?: number;
}

const buildUrl = (path: string, query?: Query): string => {
    const url = new URL(API_URL + path);
    for (const [k, v] of Object.entries(query ?? {})) {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
    return url.toString();
};

async function send(path: string, opts: Options, token: string | null): Promise<Response> {
    const headers: Record<string, string> = {};
    if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
        return await fetch(buildUrl(path, opts.query), {
            method: opts.method ?? 'GET',
            headers,
            body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
            ...(opts.revalidate === undefined ? {} : { next: { revalidate: opts.revalidate } }),
        });
    } catch {
        throw new ApiError(0, 'network', 'ارتباط با سرور برقرار نشد؛ اینترنت یا سرور را بررسی کنید');
    }
}

async function parse<T>(res: Response): Promise<GenericResponse<T>> {
    if (res.status === 204) return {};
    let json: { data?: T; total?: number; error?: { code?: string; message?: string } } = {};
    try {
        json = await res.json();
    } catch {
        // پاسخ غیر JSON
    }
    if (!res.ok) {
        throw new ApiError(res.status, json.error?.code ?? 'error', json.error?.message ?? 'خطای ناشناخته');
    }
    return { data: json.data, total: json.total };
}

/** درخواست JSON با توکن و نوسازی خودکار نشست (یک‌بار تلاش مجدد پس از ۴۰۱) */
export async function api<T>(path: string, opts: Options = {}): Promise<GenericResponse<T>> {
    const useAuth = opts.auth !== false;
    let res = await send(path, opts, useAuth ? getAccessToken() : null);
    if (res.status === 401 && useAuth) {
        const ok = await refreshSession();
        if (ok) res = await send(path, opts, getAccessToken());
    }
    return parse<T>(res);
}

/** دانلود فایل (CSV/JSON) با توکن */
export async function download(path: string, filename: string): Promise<void> {
    let res = await send(path, {}, getAccessToken());
    if (res.status === 401 && (await refreshSession())) res = await send(path, {}, getAccessToken());
    if (!res.ok) {
        throw new ApiError(res.status, 'download', 'دانلود ناموفق بود');
    }
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
}
