import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../assets/js/apps-data.js';

const REQUIRED_IDS = ['faro', 'roll', 'kept', 'shin', 'vow'];

test('APPS contains exactly the 5 expected apps, in order', () => {
  assert.deepEqual(APPS.map((a) => a.id), REQUIRED_IDS);
});

test('every app has name, icon, tagline, philosophy, and benefit in both languages', () => {
  for (const app of APPS) {
    assert.ok(app.name, `${app.id} missing name`);
    assert.ok(app.icon, `${app.id} missing icon`);
    for (const field of ['tagline', 'philosophy', 'benefit']) {
      assert.ok(app[field]?.de, `${app.id} missing ${field}.de`);
      assert.ok(app[field]?.en, `${app.id} missing ${field}.en`);
    }
  }
});

test('every app has exactly 3 screenshots per language', () => {
  for (const app of APPS) {
    assert.equal(app.screenshots.de.length, 3, `${app.id} de screenshots`);
    assert.equal(app.screenshots.en.length, 3, `${app.id} en screenshots`);
  }
});

test('vow is the only app without a live store URL', () => {
  const withoutStore = APPS.filter((a) => !a.storeUrl);
  assert.equal(withoutStore.length, 1);
  assert.equal(withoutStore[0].id, 'vow');
});

test('every app has a theme with bg, surface, text, accent, buttonText, and font', () => {
  for (const app of APPS) {
    for (const field of ['bg', 'surface', 'text', 'accent', 'buttonText', 'font']) {
      assert.ok(app.theme?.[field], `${app.id} missing theme.${field}`);
    }
  }
});

test('no copy field contains an em-dash', () => {
  const emDash = /[—–]/;
  for (const app of APPS) {
    for (const field of ['tagline', 'philosophy', 'benefit']) {
      assert.ok(!emDash.test(app[field].de), `${app.id} ${field}.de has an em/en-dash`);
      assert.ok(!emDash.test(app[field].en), `${app.id} ${field}.en has an em/en-dash`);
    }
  }
});
