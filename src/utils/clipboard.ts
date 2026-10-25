/**
 * متن را در کلیپ‌بورد می‌گذارد. Safari و صفحه‌های غیر‌HTTPS گاهی `navigator.clipboard` ندارند
 * یا رد می‌کنند؛ در آن حالت با یک textarea موقت کپی می‌شود (باید داخل رویداد لمس/کلیک صدا زده شود).
 */
export async function copyText(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.className = 'fixed start-0 top-0 opacity-0';
        document.body.append(field);
        field.select();
        field.setSelectionRange(0, text.length);
        try {
            return document.execCommand('copy');
        } catch {
            return false;
        } finally {
            field.remove();
        }
    }
}
