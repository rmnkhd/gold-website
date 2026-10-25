export type Debouncer<T> = ((value: T) => void) & { cancel: () => void };

export function createDebouncer<T>(callback: (value: T) => void, delay: number): Debouncer<T> {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const debounce = ((value: T) => {
        if (timeout !== undefined) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = undefined;
            callback(value);
        }, delay);
    }) as Debouncer<T>;

    debounce.cancel = () => {
        if (timeout !== undefined) clearTimeout(timeout);
        timeout = undefined;
    };

    return debounce;
}
