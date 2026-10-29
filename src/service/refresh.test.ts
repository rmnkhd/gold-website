import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createRefresher, RefreshRejected } from './refresh.ts';

interface Fake {
    token: string | null;
    cleared: number;
    calls: number;
}

function make(call: (f: Fake) => Promise<string>, lock?: <T>(fn: () => Promise<T>) => Promise<T>) {
    const f: Fake = { token: 'old', cleared: 0, calls: 0 };
    const refresh = createRefresher<string>({
        marker: () => f.token,
        call: async () => {
            f.calls++;
            return call(f);
        },
        apply: (s) => {
            f.token = s;
        },
        clear: () => {
            f.token = null;
            f.cleared++;
        },
        withLock: lock ?? ((fn) => fn()),
    });
    return { f, refresh };
}

test('موفق: نشست تازه ذخیره می‌شود', async () => {
    const { f, refresh } = make(async () => 'new');
    assert.equal(await refresh(), true);
    assert.equal(f.token, 'new');
});

test('قطعی شبکه نشست را پاک نمی‌کند', async () => {
    const { f, refresh } = make(async () => {
        throw new TypeError('Failed to fetch');
    });
    assert.equal(await refresh(), false);
    assert.equal(f.token, 'old');
    assert.equal(f.cleared, 0);
});

test('خطای موقت سرور (۵xx) نشست را پاک نمی‌کند', async () => {
    const { f, refresh } = make(async () => {
        throw new Error('HTTP 503');
    });
    assert.equal(await refresh(), false);
    assert.equal(f.cleared, 0);
});

test('رد قطعی سرور (۴۰۱) نشست را پاک می‌کند', async () => {
    const { f, refresh } = make(async () => {
        throw new RefreshRejected(401);
    });
    assert.equal(await refresh(), false);
    assert.equal(f.token, null);
    assert.equal(f.cleared, 1);
});

test('درخواست‌های هم‌زمان یک نوسازی مشترک دارند', async () => {
    let release: () => void = () => {};
    const gate = new Promise<void>((r) => (release = r));
    const { f, refresh } = make(async () => {
        await gate;
        return 'new';
    });
    const a = refresh();
    const b = refresh();
    release();
    assert.deepEqual(await Promise.all([a, b]), [true, true]);
    assert.equal(f.calls, 1);
});

test('تب دیگر در انتظار قفل نشست را نو کرد → درخواست دوباره نمی‌رود', async () => {
    let holder: Promise<void> = Promise.resolve();
    // قفل بین «تب‌ها»: دومی تا پایان اولی منتظر می‌ماند
    const lock = <T,>(fn: () => Promise<T>): Promise<T> => {
        const run = holder.then(fn);
        holder = run.then(
            () => undefined,
            () => undefined
        );
        return run;
    };
    const shared = { token: 'old' as string | null, calls: 0 };
    const mk = () =>
        createRefresher<string>({
            marker: () => shared.token,
            call: async () => {
                shared.calls++;
                await new Promise((r) => setTimeout(r, 10));
                return 'new-' + shared.calls;
            },
            apply: (s) => {
                shared.token = s;
            },
            clear: () => {
                shared.token = null;
            },
            withLock: lock,
        });
    const tabA = mk();
    const tabB = mk();
    const results = await Promise.all([tabA(), tabB()]);
    assert.deepEqual(results, [true, true]);
    assert.equal(shared.calls, 1, 'فقط یک تب باید refresh را بزند');
});

test('پس از پایان، نوسازی بعدی دوباره اجرا می‌شود', async () => {
    const { f, refresh } = make(async (x) => 'v' + x.calls);
    await refresh();
    await refresh();
    assert.equal(f.calls, 2);
});
