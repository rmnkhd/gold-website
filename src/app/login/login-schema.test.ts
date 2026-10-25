import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { loginSchema, safeNext } from './login-schema.ts';

describe('loginSchema', () => {
    it('شماره‌ی معتبر را می‌پذیرد', () => {
        assert.equal(loginSchema.safeParse({ phone: '09123456789', code: '', name: '' }).success, true);
    });

    it('شماره‌ی نامعتبر را رد می‌کند', () => {
        assert.equal(loginSchema.safeParse({ phone: '12345', code: '', name: '' }).success, false);
    });
});

describe('safeNext', () => {
    it('مسیر داخلی را نگه می‌دارد', () => {
        assert.equal(safeNext('/sellers/x'), '/sellers/x');
    });

    it('آدرس بیرونی یا خالی را به حساب برمی‌گرداند', () => {
        assert.equal(safeNext('https://evil.example'), '/account');
        assert.equal(safeNext('//evil.example'), '/account');
        assert.equal(safeNext(null), '/account');
    });
});
