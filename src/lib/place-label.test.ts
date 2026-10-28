import assert from 'node:assert/strict';
import test from 'node:test';

import { placeLabel } from './place-label.ts';

test('placeLabel joins city and district', () => {
    assert.equal(placeLabel('تهران', 'ولیعصر'), 'تهران · ولیعصر');
});

test('placeLabel drops an empty district instead of leaving a dangling separator', () => {
    assert.equal(placeLabel('تهران', ''), 'تهران');
    assert.equal(placeLabel('تهران', '  '), 'تهران');
    assert.equal(placeLabel('تهران', undefined), 'تهران');
});
