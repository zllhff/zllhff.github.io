import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectLang, pick, STRINGS } from '../assets/js/i18n.js';

test('detectLang recognizes de-DE as German', () => {
  assert.equal(detectLang('de-DE'), 'de');
});

test('detectLang recognizes a bare "de" tag as German', () => {
  assert.equal(detectLang('de'), 'de');
});

test('detectLang falls back to English for any non-German locale', () => {
  assert.equal(detectLang('fr-FR'), 'en');
  assert.equal(detectLang('en-US'), 'en');
});

test('detectLang falls back to English when given undefined', () => {
  assert.equal(detectLang(undefined), 'en');
});

test('pick returns the German string when lang is de', () => {
  assert.equal(pick({ de: 'Hallo', en: 'Hello' }, 'de'), 'Hallo');
});

test('pick returns the English string when lang is en', () => {
  assert.equal(pick({ de: 'Hallo', en: 'Hello' }, 'en'), 'Hello');
});

test('pick falls back to English when the requested language key is missing', () => {
  assert.equal(pick({ en: 'Hello' }, 'de'), 'Hello');
});

test('pick returns an empty string when given no map at all', () => {
  assert.equal(pick(undefined, 'en'), '');
});

test('STRINGS has both de and en for every required UI key', () => {
  const requiredKeys = [
    'headerName', 'headerIntro', 'storeButton', 'comingSoon',
    'footerContact', 'iconAlt', 'screenshotAlt',
  ];
  for (const key of requiredKeys) {
    assert.ok(STRINGS[key], `missing STRINGS.${key}`);
    assert.ok(STRINGS[key].de, `missing STRINGS.${key}.de`);
    assert.ok(STRINGS[key].en, `missing STRINGS.${key}.en`);
  }
});
