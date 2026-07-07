import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextOpenState } from '../assets/js/accordion.js';

test('opens a card when none is open', () => {
  assert.equal(nextOpenState(null, 'faro'), 'faro');
});

test('closes the currently open card when it is clicked again', () => {
  assert.equal(nextOpenState('faro', 'faro'), null);
});

test('switches to a different card, closing the previous one', () => {
  assert.equal(nextOpenState('faro', 'roll'), 'roll');
});
