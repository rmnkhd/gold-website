// Components
import { toast } from 'sonner';

/**
 * پوشش نازک روی sonner تا لحن پیام‌ها یکدست بماند و اگر بعداً رفتار خطاها
 * عوض شد، فقط همین‌جا تغییر کند.
 */

/**
 * شناسه‌ی پیش‌فرض از روی **خودِ متن** ساخته می‌شود.
 *
 * باگِ دیده‌شده در تستِ دستی: یک ذخیره‌ی ناموفق دو توستِ **کاملاً
 * یکسان** روی هم می‌گذاشت — یکی از `onError` خودِ صفحه و یکی از تورِ
 * ایمنیِ `queryClient`. هر دو درست بودند و هر دو یک جمله می‌گفتند.
 *
 * با این شناسه، دو پیامِ هم‌متن همیشه یک توست می‌شوند، صرف‌نظر از اینکه
 * از کجا آمده‌اند. `id` صریح هنوز کار می‌کند و اولویت دارد، برای وقتی
 * که می‌خواهیم گروه‌بندی بر اساس **کد** باشد نه متن.
 */
const messageId = (prefix: string, message: string): string =>
    `${prefix}:${message.replace(/\s+/g, ' ').trim()}`;

// id اختیاری: پیامی که ممکن است دو بار صدا زده شود (مثلاً effect در
// StrictMode) با همان id فقط یک بار دیده می‌شود.
export const showSuccess = (message: string, id?: string) =>
    toast.success(message, { id: id ?? messageId('success', message) });

export const showError = (message: string, id?: string) =>
    toast.error(message, { id: id ?? messageId('error', message) });

export const showWarning = (message: string) =>
    toast.warning(message, { id: messageId('warning', message) });
