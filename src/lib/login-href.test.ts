import assert from 'node:assert/strict';
import test from 'node:test';

import { loginHref } from './login-href.ts';

test('loginHref returns to the current page after sign-in', () => {
    assert.equal(loginHref('/sellers/zarin'), '/login?next=%2Fsellers%2Fzarin');
    assert.equal(loginHref('/'), '/login');
});

test('loginHref never points the login page at itself', () => {
    assert.equal(loginHref('/login'), '/login');
    assert.equal(loginHref('/login/'), '/login');
});
