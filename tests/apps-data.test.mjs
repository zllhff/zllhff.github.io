import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPS } from '../assets/js/apps-data.js';

const REQUIRED_IDS = ['faro', 'roll', 'kept', 'shin', 'vow', 'floe'];

test('APPS contains exactly the 6 expected apps, in order', () => {
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

test('every app has 3 to 5 screenshots per language, matching de/en counts', () => {
  for (const app of APPS) {
    for (const lang of ['de', 'en']) {
      const n = app.screenshots[lang].length;
      assert.ok(n >= 3 && n <= 5, `${app.id} ${lang} has ${n} screenshots (want 3 to 5)`);
    }
    assert.equal(
      app.screenshots.de.length,
      app.screenshots.en.length,
      `${app.id} de/en screenshot counts differ`,
    );
  }
});

test('vow and floe are the apps without a live store URL (not yet released)', () => {
  const withoutStore = APPS.filter((a) => !a.storeUrl).map((a) => a.id);
  assert.deepEqual(withoutStore, ['vow', 'floe']);
});

test('every app has exactly 3 features per language', () => {
  for (const app of APPS) {
    assert.equal(app.features.de.length, 3, `${app.id} de features`);
    assert.equal(app.features.en.length, 3, `${app.id} en features`);
  }
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
    for (const lang of ['de', 'en']) {
      for (const feature of app.features[lang]) {
        assert.ok(!emDash.test(feature), `${app.id} feature "${feature}" has an em/en-dash`);
      }
    }
  }
});
