// Services
import { subscribePush, unsubscribePush } from '@/service/api/account';

const SIM_KEY = 'zarineh-front-push-endpoint-v1';
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

export type PushMode = 'real' | 'simulated';

const urlBase64ToBytes = (base64: string): Uint8Array<ArrayBuffer> => {
    const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(padded);
    const out = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
    return out;
};

const realPushSupported = (): boolean =>
    VAPID_PUBLIC_KEY !== '' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

/**
 * فعال‌کردن اعلان مرورگر.
 * - با کلید VAPID (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`) و مرورگر پشتیبان: اشتراک واقعی Web Push (مجوز اعلان گرفته می‌شود).
 * - وگرنه شبیه‌سازی: نشانی ساختگی `https://push.simulated.invalid/<uuid>` ثبت می‌شود (vault: شبیه‌سازی #11).
 */
export async function enablePush(): Promise<PushMode> {
    if (realPushSupported()) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') throw new Error('اجازه‌ی نمایش اعلان در مرورگر داده نشد');
        const registration = await navigator.serviceWorker.ready;
        const sub =
            (await registration.pushManager.getSubscription()) ??
            (await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToBytes(VAPID_PUBLIC_KEY),
            }));
        const json = sub.toJSON();
        await subscribePush({ endpoint: sub.endpoint, p256dh: json.keys?.p256dh, auth: json.keys?.auth });
        return 'real';
    }
    let endpoint = window.localStorage.getItem(SIM_KEY);
    // نسخه‌ی قدیمی نشانی غیر https ذخیره می‌کرد؛ آن را دور بینداز
    if (!endpoint?.startsWith('https://')) endpoint = `https://push.simulated.invalid/${crypto.randomUUID()}`;
    window.localStorage.setItem(SIM_KEY, endpoint);
    await subscribePush({ endpoint });
    return 'simulated';
}

/** خاموش‌کردن اعلان مرورگر؛ اشتراک واقعی و ساختگی هر دو پاک می‌شوند */
export async function disablePush(): Promise<void> {
    if (realPushSupported()) {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        if (sub) {
            await unsubscribePush(sub.endpoint);
            await sub.unsubscribe();
        }
    }
    const endpoint = window.localStorage.getItem(SIM_KEY);
    if (endpoint) {
        await unsubscribePush(endpoint);
        window.localStorage.removeItem(SIM_KEY);
    }
}
