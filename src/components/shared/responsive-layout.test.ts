import assert from 'node:assert/strict';
import test from 'node:test';

import {
    pageActionsClassName,
    pageRootClassName,
    panelMainClassName,
    scrollableRowClassName,
    tableContainerClassName,
    visuallyHiddenInputGuardClassName,
} from './responsive-layout.ts';

function hasClass(className: string, token: string) {
    return className.split(/\s+/).includes(token);
}

test('panel content can shrink instead of widening the viewport', () => {
    assert.equal(hasClass(panelMainClassName(), 'min-w-0'), true);
    assert.equal(hasClass(panelMainClassName(), 'max-w-full'), true);
    assert.equal(hasClass(pageRootClassName(), 'min-w-0'), true);
    assert.equal(hasClass(pageRootClassName(), 'max-w-full'), true);
});

test('page actions wrap inside the mobile viewport', () => {
    const className = pageActionsClassName();

    assert.equal(hasClass(className, 'w-full'), true);
    assert.equal(hasClass(className, 'flex-wrap'), true);
    assert.equal(hasClass(className, 'sm:w-auto'), true);
});

test('wide rows and tables own their horizontal scrolling', () => {
    for (const className of [scrollableRowClassName(), tableContainerClassName()]) {
        assert.equal(hasClass(className, 'max-w-full'), true);
        assert.equal(hasClass(className, 'overflow-x-auto'), true);
        assert.equal(hasClass(className, 'overscroll-x-contain'), true);
    }
});

test('visually hidden inputs cannot retain their full-width base style', () => {
    const className = visuallyHiddenInputGuardClassName();

    assert.equal(hasClass(className, '[&.sr-only]:!size-px'), true);
    assert.equal(hasClass(className, '[&.sr-only]:!min-w-px'), true);
});
