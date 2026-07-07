# Portfolio Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current text-list `index.html` on `zllhff.github.io` with a two-column, single-open-accordion grid of all 5 apps (Faro, Roll, Kept, Shin, Vow), each expandable to philosophy, benefit, screenshots, and an App Store link, in German and English.

**Architecture:** Static vanilla HTML/CSS/JS (ES modules), no build step, no framework, no dependencies. Pure logic (language pick, accordion open/close state) lives in small standalone modules with `node --test` unit tests. Rendering is plain DOM manipulation driven by a single data module (`apps-data.js`). Deployed as-is via GitHub Pages (no new hosting setup).

**Tech Stack:** HTML5, CSS3 (custom properties, CSS Grid, `prefers-color-scheme`/`prefers-reduced-motion`), vanilla JS ES modules, Node.js built-in test runner (`node --test`) for pure-logic unit tests.

## Global Constraints

- Repo root: `/Users/jan/Documents/Claude/zllhff.github.io` (git remote `github.com/zllhff/zllhff.github.io`).
- No new hosting/domain work. Only `index.html` at repo root is replaced; existing per-app subpages (`faro/`, `roll/`, `kept/`, `shin/`) are untouched.
- Design dials: `VARIANCE 6 / MOTION 4 / DENSITY 3`. Neutral background (`prefers-color-scheme` driven), no page-wide accent color, one radius system, no emoji, **zero em-dashes anywhere in copy or markup**.
- 2-column CSS Grid (1-column below 720px), 5 cards, all equal size closed. Only one card open at a time. Opening a card sets `grid-column: 1 / -1` and expands via CSS Grid `grid-template-rows` (`0fr` → `1fr`), not `max-height`.
- Language: single page, JS toggle (DE/EN), no reload, default from `navigator.language`, fallback English.
- Vow has no store URL yet (ASC submission pending) — its card shows a "coming soon" label instead of a store button.
- Commit after every task.

---

## File Structure

```
zllhff.github.io/
├── package.json                       # new, {"type": "module"} only — no deps, no build
├── index.html                         # replaced
├── assets/
│   ├── css/
│   │   └── styles.css                 # new
│   ├── js/
│   │   ├── i18n.js                    # new, pure — strings + detectLang + pick
│   │   ├── accordion.js               # new, pure — single-open state transition
│   │   ├── apps-data.js               # new — the 5 apps' content (DE/EN)
│   │   └── main.js                    # new — DOM rendering + wiring
│   ├── icons/
│   │   ├── faro.png
│   │   ├── roll.png
│   │   ├── kept.png
│   │   ├── shin.png
│   │   └── vow.png
│   └── screenshots/
│       ├── faro/{de,en}/{1,2,3}.jpg
│       ├── roll/{de,en}/{1,2,3}.jpg
│       ├── kept/{de,en}/{1,2,3}.jpg
│       ├── shin/{de,en}/{1,2,3}.jpg
│       └── vow/{de,en}/{1,2,3}.jpg    # de and en are identical copies (Vow has no
│                                       # separate localized capture yet, per spec)
├── scripts/
│   └── prepare-assets.sh              # new — one-shot copy/resize script (not run in CI)
└── tests/
    ├── accordion.test.mjs             # new
    ├── i18n.test.mjs                  # new
    └── apps-data.test.mjs             # new
```

---

### Task 1: Pure logic modules (`i18n.js`, `accordion.js`) with unit tests

**Files:**
- Create: `package.json`
- Create: `assets/js/i18n.js`
- Create: `assets/js/accordion.js`
- Test: `tests/i18n.test.mjs`
- Test: `tests/accordion.test.mjs`

**Interfaces:**
- Produces: `detectLang(navigatorLanguage: string | undefined): 'de' | 'en'`
- Produces: `pick(map: { de?: string, en?: string } | undefined, lang: 'de' | 'en'): string`
- Produces: `STRINGS: Record<string, { de: string, en: string }>` (keys used later: `headerName`, `headerIntro`, `storeButton`, `comingSoon`, `footerContact`, `iconAlt`, `screenshotAlt`)
- Produces: `nextOpenState(currentOpenId: string | null, clickedId: string): string | null`
- Consumes: nothing (leaf modules)

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "zllhff-github-io",
  "private": true,
  "type": "module",
  "description": "Static GitHub Pages site. No build step, no dependencies. type:module lets both the browser (via <script type=module>) and Node's test runner treat assets/js/*.js as ES modules."
}
```

- [ ] **Step 2: Write the failing tests for `i18n.js`**

Create `tests/i18n.test.mjs`:

```js
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
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `node --test tests/i18n.test.mjs`
Expected: FAIL (module `assets/js/i18n.js` not found)

- [ ] **Step 4: Implement `assets/js/i18n.js`**

```js
export function detectLang(navigatorLanguage) {
  if (typeof navigatorLanguage !== 'string') return 'en';
  return navigatorLanguage.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export function pick(map, lang) {
  if (!map) return '';
  return map[lang] || map.en || '';
}

export const STRINGS = {
  headerName: {
    de: 'Jan Zellerhoff',
    en: 'Jan Zellerhoff',
  },
  headerIntro: {
    de: 'Fünf ruhige iOS-Apps. Privacy-first, für die Dauer gebaut.',
    en: 'Five quiet iOS apps. Privacy-first, built to last.',
  },
  storeButton: {
    de: 'Im App Store ansehen',
    en: 'View on the App Store',
  },
  comingSoon: {
    de: 'Bald im App Store',
    en: 'Coming soon to the App Store',
  },
  footerContact: {
    de: 'Fragen zu Datenschutz, Support oder allem anderen:',
    en: 'For privacy questions, support, or anything else:',
  },
  iconAlt: {
    de: 'App-Icon',
    en: 'App icon',
  },
  screenshotAlt: {
    de: 'Screenshot',
    en: 'Screenshot',
  },
};
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `node --test tests/i18n.test.mjs`
Expected: PASS (9 tests)

- [ ] **Step 6: Write the failing tests for `accordion.js`**

Create `tests/accordion.test.mjs`:

```js
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
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `node --test tests/accordion.test.mjs`
Expected: FAIL (module `assets/js/accordion.js` not found)

- [ ] **Step 8: Implement `assets/js/accordion.js`**

```js
export function nextOpenState(currentOpenId, clickedId) {
  return currentOpenId === clickedId ? null : clickedId;
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `node --test tests/accordion.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 10: Commit**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
git add package.json assets/js/i18n.js assets/js/accordion.js tests/i18n.test.mjs tests/accordion.test.mjs
git commit -m "Add i18n and accordion pure logic modules with tests"
```

---

### Task 2: App content data module (`apps-data.js`)

**Files:**
- Create: `assets/js/apps-data.js`
- Test: `tests/apps-data.test.mjs`

**Interfaces:**
- Consumes: nothing
- Produces: `APPS: Array<{ id: string, name: string, icon: string, storeUrl: string | null, tagline: {de,en}, philosophy: {de,en}, benefit: {de,en}, screenshots: { de: string[3], en: string[3] } }>` — this is the array `main.js` (Task 5) iterates to render cards.

- [ ] **Step 1: Write the failing data-shape test**

Create `tests/apps-data.test.mjs`:

```js
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

test('no copy field contains an em-dash', () => {
  const emDash = /[—–]/;
  for (const app of APPS) {
    for (const field of ['tagline', 'philosophy', 'benefit']) {
      assert.ok(!emDash.test(app[field].de), `${app.id} ${field}.de has an em/en-dash`);
      assert.ok(!emDash.test(app[field].en), `${app.id} ${field}.en has an em/en-dash`);
    }
  }
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/apps-data.test.mjs`
Expected: FAIL (module `assets/js/apps-data.js` not found)

- [ ] **Step 3: Implement `assets/js/apps-data.js`**

```js
export const APPS = [
  {
    id: 'faro',
    name: 'Faro',
    icon: 'assets/icons/faro.png',
    storeUrl: 'https://apps.apple.com/de/app/faro-eine-t%C3%A4gliche-reise/id6785093908',
    tagline: {
      de: 'Ein tägliches Versprechen lässt ein Boot über die echte Weltkarte segeln.',
      en: 'A daily promise sails a boat across a real world map.',
    },
    philosophy: {
      de: 'Faro macht aus einem kleinen, täglichen Versprechen eine ruhige, fortlaufende Reise. Statt Streaks, die bei einem verpassten Tag alles zunichtemachen, wartet dein Boot einfach vor Anker, bis du bereit bist. Fortschritt ist Geografie, nicht Schuldgefühl.',
      en: "Faro turns keeping one small daily promise into a quiet, ongoing journey. Instead of streaks that punish a missed day, your boat simply waits at anchor until you're ready again. Progress is geography, not guilt.",
    },
    benefit: {
      de: 'Halte deine Gewohnheit durch und entdecke echte Städte und Länder auf einer echten Karte. Einmal kaufen, kein Abo, alles bleibt auf deinem Gerät. Kein Account, kein Druck, kein verlorener Fortschritt.',
      en: "Keep your habit and watch real cities and countries reveal themselves on an actual map. Buy once, no subscription, everything stays on your device. No account, no pressure, no lost progress.",
    },
    screenshots: {
      de: [
        'assets/screenshots/faro/de/1.jpg',
        'assets/screenshots/faro/de/2.jpg',
        'assets/screenshots/faro/de/3.jpg',
      ],
      en: [
        'assets/screenshots/faro/en/1.jpg',
        'assets/screenshots/faro/en/2.jpg',
        'assets/screenshots/faro/en/3.jpg',
      ],
    },
  },
  {
    id: 'roll',
    name: 'Roll',
    icon: 'assets/icons/roll.png',
    storeUrl: 'https://apps.apple.com/de/app/roll-foto-kuration/id6772247083',
    tagline: {
      de: 'Foto-Kuration, komplett auf dem Gerät. Deine Bibliothek, durchdacht.',
      en: 'Photo curation, on-device. Your library, considered.',
    },
    philosophy: {
      de: 'Roll findet, dass Tausende Fotos aufzuräumen keine Stunden Wischen und keinen Cloud-Dienst braucht, der deine privaten Bilder sieht. Sortieren passiert komplett auf deinem iPhone, eine klare Entscheidung nach der anderen.',
      en: "Roll believes tidying thousands of photos shouldn't take hours of scrolling, and shouldn't need a cloud service that sees your private pictures. Sorting happens entirely on your iPhone, one clear decision at a time.",
    },
    benefit: {
      de: 'Roll zeigt dir schwache Aufnahmen, Serienbilder, unscharfe Fotos und Screenshots, damit du sie in Minuten statt Stunden loswirst. Deine Fotos verlassen nie dein Handy.',
      en: "Roll surfaces the weak shots, bursts, blurry frames, and screenshots so you can clear them out in minutes instead of hours. Your photos never leave your phone.",
    },
    screenshots: {
      de: [
        'assets/screenshots/roll/de/1.jpg',
        'assets/screenshots/roll/de/2.jpg',
        'assets/screenshots/roll/de/3.jpg',
      ],
      en: [
        'assets/screenshots/roll/en/1.jpg',
        'assets/screenshots/roll/en/2.jpg',
        'assets/screenshots/roll/en/3.jpg',
      ],
    },
  },
  {
    id: 'kept',
    name: 'kept',
    icon: 'assets/icons/kept.png',
    storeUrl: 'https://apps.apple.com/de/app/kept-dokumente-scanner/id6777199188',
    tagline: {
      de: 'Ein ruhiger Ort für deine Dokumente. Privacy-first Dokumenten-Organizer.',
      en: 'A quiet place for your papers. Privacy-first document organizer.',
    },
    philosophy: {
      de: 'kept behandelt deine Dokumente wie ein guter Aktenschrank: leise, privat, ohne Rückfragen. Kein Server entscheidet, wie dein Reisepass oder Mietvertrag sortiert wird. Dein iPhone tut das, und nur du siehst es.',
      en: 'kept treats your documents the way a good filing cabinet does: quietly, privately, without asking questions. No server decides how your passport or lease gets organized. Your iPhone does, and only you can see it.',
    },
    benefit: {
      de: 'Scanne, unterschreibe und organisiere Reisepässe, Belege und Verträge in Sekunden. Apple Intelligence benennt jeden Scan automatisch, Kündigungsschreiben kommen fertig formatiert. Einmal kaufen, die ganze Familie kann es nutzen.',
      en: 'Scan, sign, and organize passports, receipts, and contracts in seconds. Apple Intelligence names every scan for you, and cancellation letters come pre-formatted. Buy once, your whole family can use it.',
    },
    screenshots: {
      de: [
        'assets/screenshots/kept/de/1.jpg',
        'assets/screenshots/kept/de/2.jpg',
        'assets/screenshots/kept/de/3.jpg',
      ],
      en: [
        'assets/screenshots/kept/en/1.jpg',
        'assets/screenshots/kept/en/2.jpg',
        'assets/screenshots/kept/en/3.jpg',
      ],
    },
  },
  {
    id: 'shin',
    name: 'shin.',
    icon: 'assets/icons/shin.png',
    storeUrl: 'https://apps.apple.com/de/app/shin-brich-den-autopilot/id6759466244',
    tagline: {
      de: 'Brich den Autopilot. Persönliche Achtsamkeit für iOS.',
      en: 'Break the autopilot. Personal awareness for iOS.',
    },
    philosophy: {
      de: 'shin. ist ein ruhiger Begleiter, der zeigt, wie du wirklich durch deine Tage gehst, statt im Autopilot zu laufen. Es gibt keinen Punktestand und nichts vorzuspielen. Es spiegelt einfach deine Muster zurück.',
      en: 'shin. is a quiet companion for noticing how you actually move through your days, instead of running on autopilot. There is no score to chase and nothing to perform for. It simply reflects your patterns back to you.',
    },
    benefit: {
      de: 'Erkenne Muster in deinem Alltag und durchbrich die, die dir nicht guttun. Alles bleibt auf deinem Gerät. Keine Accounts, keine Analyse, keine Cloud.',
      en: "Notice the patterns in your days and break the ones that don't serve you. Everything stays on your device. No accounts, no analytics, no cloud.",
    },
    screenshots: {
      de: [
        'assets/screenshots/shin/de/1.jpg',
        'assets/screenshots/shin/de/2.jpg',
        'assets/screenshots/shin/de/3.jpg',
      ],
      en: [
        'assets/screenshots/shin/en/1.jpg',
        'assets/screenshots/shin/en/2.jpg',
        'assets/screenshots/shin/en/3.jpg',
      ],
    },
  },
  {
    id: 'vow',
    name: 'Vow',
    icon: 'assets/icons/vow.png',
    storeUrl: null,
    tagline: {
      de: 'Ein Versprechen, gehalten durch Ritual. Fokus und App-Blocker für iOS.',
      en: 'A promise, kept by ritual. Focus and app blocking for iOS.',
    },
    philosophy: {
      de: 'Vow macht das Weglegen des Handys zu einem kleinen Ritual statt einem Willenskraft-Kampf. Tippe einen NFC-Sticker an oder starte eine Session, und eine Phase wie Deep Work, Familienzeit oder Schlaf beginnt, mit deinen ablenkenden Apps wirklich außer Reichweite.',
      en: 'Vow turns putting your phone down into a small ritual instead of a battle of willpower. Tap an NFC sticker or start a session, and a phase like deep work, family time, or sleep begins, with your distracting apps genuinely out of reach.',
    },
    benefit: {
      de: 'Wähle eine Phase, löse sie per Ritual aus, und lass Benachrichtigungen geräteübergreifend verstummen. Keine Gamification, keine Streaks zu pflegen, nur ein Wort, das du dir selbst hältst.',
      en: 'Choose a phase, trigger it by ritual, and let notifications go quiet across your devices. No gamification, no streaks to maintain, just a word you keep with yourself.',
    },
    screenshots: {
      de: [
        'assets/screenshots/vow/de/1.jpg',
        'assets/screenshots/vow/de/2.jpg',
        'assets/screenshots/vow/de/3.jpg',
      ],
      en: [
        'assets/screenshots/vow/en/1.jpg',
        'assets/screenshots/vow/en/2.jpg',
        'assets/screenshots/vow/en/3.jpg',
      ],
    },
  },
];
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tests/apps-data.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
git add assets/js/apps-data.js tests/apps-data.test.mjs
git commit -m "Add apps-data content module with DE/EN copy for all 5 apps"
```

---

### Task 3: Asset preparation (icons + screenshots)

**Files:**
- Create: `scripts/prepare-assets.sh`
- Create: `assets/icons/{faro,roll,kept,shin,vow}.png`
- Create: `assets/screenshots/{faro,roll,kept,shin}/{de,en}/{1,2,3}.jpg`
- Create: `assets/screenshots/vow/{de,en}/{1,2,3}.jpg` (captured fresh from simulator, see Step 3 below)

**Interfaces:**
- Consumes: `apps-data.js` screenshot/icon path conventions from Task 2 (must produce files at exactly those paths).
- Produces: image files on disk that Task 4/5's HTML/CSS reference directly. No code interface.

- [ ] **Step 1: Create the icon and screenshot copy script**

Create `scripts/prepare-assets.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

REPO="/Users/jan/Documents/Claude/zllhff.github.io"
mkdir -p "$REPO/assets/icons"
for app in faro roll kept shin vow; do
  mkdir -p "$REPO/assets/screenshots/$app/de" "$REPO/assets/screenshots/$app/en"
done

# --- Icons (copied as-is, all sources are already 120x120 flattened renders) ---
cp "/Users/jan/Documents/Claude/Faro/build/Faro.xcarchive/Products/Applications/Faro.app/Faro60x60@2x.png" \
  "$REPO/assets/icons/faro.png"
cp "/Users/jan/Documents/Claude/roll/.asc/artifacts/Roll-IOS-1.2.0-1.xcarchive/Products/Applications/Roll.app/AppIcon60x60@2x.png" \
  "$REPO/assets/icons/roll.png"
cp "/Users/jan/Documents/Claude/kept app/release/Filed.xcarchive/Products/Applications/Filed.app/AppIcon60x60@2x.png" \
  "$REPO/assets/icons/kept.png"
cp "/Users/jan/Documents/Claude/shin app/.asc/artifacts/Shin-1.2.1-11.xcarchive/Products/Applications/shin.app/AppIcon60x60@2x.png" \
  "$REPO/assets/icons/shin.png"
cp "/Users/jan/Documents/Claude/Still/build/Build/Products/Debug-iphonesimulator/Still.app/AppIcon60x60@2x.png" \
  "$REPO/assets/icons/vow.png"

# --- Screenshots: resize to 480px width, convert to JPEG quality 82 ---
resize() {
  local src="$1" dest="$2"
  sips -s format jpeg -s formatOptions 82 --resampleWidth 480 "$src" --out "$dest" >/dev/null
}

FARO_SRC_DE="/Users/jan/Documents/Claude/Faro/store_assets/screenshots/de-DE"
FARO_SRC_EN="/Users/jan/Documents/Claude/Faro/store_assets/screenshots/en-US"
resize "$FARO_SRC_DE/01-hero.png"      "$REPO/assets/screenshots/faro/de/1.jpg"
resize "$FARO_SRC_DE/04-challenge.png" "$REPO/assets/screenshots/faro/de/2.jpg"
resize "$FARO_SRC_DE/05a-atlas.png"    "$REPO/assets/screenshots/faro/de/3.jpg"
resize "$FARO_SRC_EN/01-hero.png"      "$REPO/assets/screenshots/faro/en/1.jpg"
resize "$FARO_SRC_EN/04-challenge.png" "$REPO/assets/screenshots/faro/en/2.jpg"
resize "$FARO_SRC_EN/05a-atlas.png"    "$REPO/assets/screenshots/faro/en/3.jpg"

ROLL_SRC_DE="/Users/jan/Documents/Claude/roll/store_assets/screenshots/de/raw"
ROLL_SRC_EN="/Users/jan/Documents/Claude/roll/store_assets/screenshots/en/raw"
resize "$ROLL_SRC_DE/scene-01-hero.png"       "$REPO/assets/screenshots/roll/de/1.jpg"
resize "$ROLL_SRC_DE/scene-02-cleanup.png"    "$REPO/assets/screenshots/roll/de/2.jpg"
resize "$ROLL_SRC_DE/scene-04-fullscreen.png" "$REPO/assets/screenshots/roll/de/3.jpg"
resize "$ROLL_SRC_EN/scene-01-hero.png"       "$REPO/assets/screenshots/roll/en/1.jpg"
resize "$ROLL_SRC_EN/scene-02-cleanup.png"    "$REPO/assets/screenshots/roll/en/2.jpg"
resize "$ROLL_SRC_EN/scene-04-fullscreen.png" "$REPO/assets/screenshots/roll/en/3.jpg"

KEPT_SRC="/Users/jan/Documents/Claude/kept app/docs/asc/screenshots-raw"
resize "$KEPT_SRC/iphone69_de_library.png" "$REPO/assets/screenshots/kept/de/1.jpg"
resize "$KEPT_SRC/iphone69_de_actions.png" "$REPO/assets/screenshots/kept/de/2.jpg"
resize "$KEPT_SRC/iphone69_de_search.png"  "$REPO/assets/screenshots/kept/de/3.jpg"
resize "$KEPT_SRC/iphone69_en_library.png" "$REPO/assets/screenshots/kept/en/1.jpg"
resize "$KEPT_SRC/iphone69_en_actions.png" "$REPO/assets/screenshots/kept/en/2.jpg"
resize "$KEPT_SRC/iphone69_en_search.png"  "$REPO/assets/screenshots/kept/en/3.jpg"

SHIN_SRC_DE="/Users/jan/Documents/Claude/shin app/store_assets/screenshots/de-DE"
SHIN_SRC_EN="/Users/jan/Documents/Claude/shin app/store_assets/screenshots/en-US"
resize "$SHIN_SRC_DE/6_9_01_hero.png"   "$REPO/assets/screenshots/shin/de/1.jpg"
resize "$SHIN_SRC_DE/6_9_02_today.png"  "$REPO/assets/screenshots/shin/de/2.jpg"
resize "$SHIN_SRC_DE/6_9_05_letter.png" "$REPO/assets/screenshots/shin/de/3.jpg"
resize "$SHIN_SRC_EN/6_9_01_hero.png"   "$REPO/assets/screenshots/shin/en/1.jpg"
resize "$SHIN_SRC_EN/6_9_02_today.png"  "$REPO/assets/screenshots/shin/en/2.jpg"
resize "$SHIN_SRC_EN/6_9_05_letter.png" "$REPO/assets/screenshots/shin/en/3.jpg"

echo "Done. Vow screenshots are NOT handled by this script (no existing source) — see Task 3 Step 3 of the plan."
```

- [ ] **Step 2: Run the script and verify the files exist**

```bash
chmod +x /Users/jan/Documents/Claude/zllhff.github.io/scripts/prepare-assets.sh
/Users/jan/Documents/Claude/zllhff.github.io/scripts/prepare-assets.sh
find /Users/jan/Documents/Claude/zllhff.github.io/assets/icons -type f
find /Users/jan/Documents/Claude/zllhff.github.io/assets/screenshots -type f | sort
```

Expected: 5 files under `assets/icons/`, 24 files under `assets/screenshots/` (4 apps × 2 languages × 3 images; Vow not yet present).

- [ ] **Step 3: Capture Vow screenshots from the simulator**

Vow (`/Users/jan/Documents/Claude/Still`) has no App Store screenshots yet (submission pending). Capture 3 fresh simulator screenshots and reuse the same 3 images for both `de` and `en` (the spec does not require a separate localized capture for Vow):

1. Use the XcodeBuildMCP tools (`session_show_defaults`, then `build_run_sim` if the project/scheme/simulator defaults aren't already set for the `Still` project) to build and launch the Still app in the iOS Simulator.
2. Navigate to and capture (via the `screenshot` tool) these 3 screens:
   - The phase/profile selection home screen (shows the 4 profiles: Deep Work, Familienzeit, Sport, Schlaf).
   - An active session screen (start the "Deep Work" phase, then screenshot the running/blocked state).
   - The settings/profile-list screen.
3. Save the 3 raw screenshots to a temp location, then resize and copy into place:

```bash
REPO="/Users/jan/Documents/Claude/zllhff.github.io"
sips -s format jpeg -s formatOptions 82 --resampleWidth 480 /path/to/vow-raw-1.png --out "$REPO/assets/screenshots/vow/de/1.jpg"
sips -s format jpeg -s formatOptions 82 --resampleWidth 480 /path/to/vow-raw-2.png --out "$REPO/assets/screenshots/vow/de/2.jpg"
sips -s format jpeg -s formatOptions 82 --resampleWidth 480 /path/to/vow-raw-3.png --out "$REPO/assets/screenshots/vow/de/3.jpg"
cp "$REPO/assets/screenshots/vow/de/1.jpg" "$REPO/assets/screenshots/vow/en/1.jpg"
cp "$REPO/assets/screenshots/vow/de/2.jpg" "$REPO/assets/screenshots/vow/en/2.jpg"
cp "$REPO/assets/screenshots/vow/de/3.jpg" "$REPO/assets/screenshots/vow/en/3.jpg"
```

- [ ] **Step 4: Verify all 5 apps now have complete assets**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
for app in faro roll kept shin vow; do
  echo "$app icon:"; ls assets/icons/$app.png
  echo "$app de shots:"; ls assets/screenshots/$app/de/ | wc -l
  echo "$app en shots:"; ls assets/screenshots/$app/en/ | wc -l
done
```

Expected: every icon file exists, every `de`/`en` folder lists exactly 3 files.

- [ ] **Step 5: Commit**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
git add scripts/prepare-assets.sh assets/icons assets/screenshots
git commit -m "Add app icons and screenshots for the portfolio landing page"
```

---

### Task 4: Static HTML skeleton + CSS

**Files:**
- Create: `assets/css/styles.css`
- Create (temporary, overwritten in Task 5): a minimal `index.html` with one hardcoded example card, to visually verify the CSS before wiring dynamic rendering.

**Interfaces:**
- Consumes: nothing yet (Task 5 wires the real data in).
- Produces: the CSS class contract Task 5's `main.js` must emit: `.app-card`, `.app-card.is-open`, `.app-card-summary`, `.app-icon`, `.app-summary-text`, `.app-name`, `.app-tagline`, `.chevron`, `.app-card-details`, `.app-card-details-inner`, `.app-philosophy`, `.app-benefit`, `.app-screenshots`, `.app-store-button`, `.app-coming-soon`.

- [ ] **Step 1: Create `assets/css/styles.css`**

```css
:root {
  --bg: #fafafa;
  --surface: #ffffff;
  --border: #e5e5e5;
  --text: #1a1a1a;
  --muted: #666666;
  --radius: 16px;
  --radius-sm: 10px;
  --max-width: 880px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #101010;
    --surface: #1a1a1a;
    --border: #2c2c2c;
    --text: #f2f2f2;
    --muted: #9a9a9a;
  }
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.page {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 48px 20px 80px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 48px;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.intro {
  color: var(--muted);
  font-size: 1rem;
  max-width: 40ch;
}

.lang-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 999px;
  overflow: hidden;
  background: none;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}

.lang-option {
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--muted);
}

.lang-option.is-active {
  background: var(--text);
  color: var(--bg);
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 720px) {
  .app-grid { grid-template-columns: 1fr; }
}

.app-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
}

.app-card.is-open {
  grid-column: 1 / -1;
}

.app-card-summary {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

.app-icon {
  border-radius: 22%;
  flex-shrink: 0;
  display: block;
}

.app-summary-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.app-name {
  font-size: 1.05rem;
  font-weight: 600;
}

.app-tagline {
  font-size: 0.88rem;
  color: var(--muted);
}

.chevron {
  color: var(--muted);
  flex-shrink: 0;
  transition: transform 0.3s var(--ease);
}

.app-card.is-open .chevron {
  transform: rotate(180deg);
}

.app-card-details {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s var(--ease);
}

.app-card.is-open .app-card-details {
  grid-template-rows: 1fr;
}

.app-card-details-inner {
  overflow: hidden;
  min-height: 0;
  padding: 0 20px;
}

.app-card.is-open .app-card-details-inner {
  padding: 0 20px 20px;
}

.app-philosophy,
.app-benefit {
  font-size: 0.95rem;
  margin-bottom: 14px;
  max-width: 65ch;
}

.app-screenshots {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  margin-bottom: 16px;
  padding-bottom: 4px;
}

.app-screenshots img {
  scroll-snap-align: start;
  height: 280px;
  width: auto;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.app-store-button,
.app-coming-soon {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.app-store-button {
  background: var(--text);
  color: var(--bg);
}

.app-coming-soon {
  background: none;
  border: 1px solid var(--border);
  color: var(--muted);
}

.page-footer {
  margin-top: 64px;
  font-size: 0.85rem;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-footer a {
  color: inherit;
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .app-card-details,
  .chevron {
    transition: none;
  }
}
```

- [ ] **Step 2: Create a temporary `index.html` with one hardcoded example card to verify the CSS**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jan Zellerhoff · iOS Apps</title>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <div class="page">
    <header class="page-header">
      <div>
        <h1>Jan Zellerhoff</h1>
        <p class="intro">Five quiet iOS apps. Privacy-first, built to last.</p>
      </div>
      <button class="lang-toggle" type="button">
        <span class="lang-option is-active">DE</span>
        <span class="lang-option">EN</span>
      </button>
    </header>
    <main class="app-grid">
      <article class="app-card is-open">
        <button class="app-card-summary" type="button">
          <img class="app-icon" src="assets/icons/faro.png" alt="Faro app icon" width="48" height="48">
          <span class="app-summary-text">
            <span class="app-name">Faro</span>
            <span class="app-tagline">A daily promise sails a boat across a real world map.</span>
          </span>
          <svg class="chevron" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 7.5L10 12.5L15 7.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="app-card-details">
          <div class="app-card-details-inner">
            <p class="app-philosophy">Test philosophy paragraph.</p>
            <p class="app-benefit">Test benefit paragraph.</p>
            <div class="app-screenshots">
              <img src="assets/screenshots/faro/en/1.jpg" alt="Faro screenshot">
              <img src="assets/screenshots/faro/en/2.jpg" alt="Faro screenshot">
              <img src="assets/screenshots/faro/en/3.jpg" alt="Faro screenshot">
            </div>
            <a class="app-store-button" href="#">View on the App Store</a>
          </div>
        </div>
      </article>
      <article class="app-card">
        <button class="app-card-summary" type="button">
          <img class="app-icon" src="assets/icons/roll.png" alt="Roll app icon" width="48" height="48">
          <span class="app-summary-text">
            <span class="app-name">Roll</span>
            <span class="app-tagline">Photo curation, on-device.</span>
          </span>
          <svg class="chevron" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5 7.5L10 12.5L15 7.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="app-card-details">
          <div class="app-card-details-inner"></div>
        </div>
      </article>
    </main>
    <footer class="page-footer">
      <p><span>For privacy questions, support, or anything else:</span> <a href="mailto:ahoi@sent.com">ahoi@sent.com</a></p>
      <p>© 2026 Jan Zellerhoff · Dortmund, Germany</p>
    </footer>
  </div>
</body>
</html>
```

- [ ] **Step 3: Serve and visually verify in the browser**

Start a static server from the repo root (e.g. `npx serve .` or any local static server), open it via the `preview_start`/browser tools, and check:
- Grid shows 2 columns on desktop, collapses to 1 column under 720px.
- The Faro card (`is-open`) is expanded full width with visible philosophy/benefit text, a horizontally scrollable screenshot strip, and a dark pill-shaped "View on the App Store" button with readable (light) text.
- The Roll card is closed (just icon, name, tagline, chevron).
- Toggle the OS/browser to dark mode (`preview_resize` supports `colorScheme: 'dark'`) and confirm background, text, and button contrast all still read clearly.
- Resize to mobile width and confirm 1-column layout.

Expected: all of the above hold visually. Fix any CSS issues found before proceeding.

- [ ] **Step 4: Commit**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
git add assets/css/styles.css index.html
git commit -m "Add static CSS and a hardcoded example card for visual verification"
```

---

### Task 5: Dynamic rendering (`main.js`) — replace the hardcoded example

**Files:**
- Create: `assets/js/main.js`
- Modify: `index.html` (replace the hardcoded cards from Task 4 with the dynamic mount point)

**Interfaces:**
- Consumes: `APPS` from `assets/js/apps-data.js` (Task 2), `STRINGS`/`detectLang`/`pick` from `assets/js/i18n.js` (Task 1), `nextOpenState` from `assets/js/accordion.js` (Task 1), and the CSS class contract from Task 4.
- Produces: nothing further consumed by later tasks (this is the final wiring layer).

- [ ] **Step 1: Replace `index.html` with the dynamic-mount version**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jan Zellerhoff · iOS Apps</title>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <div class="page">
    <header class="page-header">
      <div>
        <h1 data-i18n="headerName">Jan Zellerhoff</h1>
        <p class="intro" data-i18n="headerIntro">Five quiet iOS apps. Privacy-first, built to last.</p>
      </div>
      <button id="lang-toggle" class="lang-toggle" type="button" aria-label="Switch language / Sprache wechseln">
        <span class="lang-option" data-lang-option="de">DE</span>
        <span class="lang-option" data-lang-option="en">EN</span>
      </button>
    </header>

    <main id="app-grid" class="app-grid" aria-live="polite"></main>

    <footer class="page-footer">
      <p><span data-i18n="footerContact">For privacy questions, support, or anything else:</span> <a href="mailto:ahoi@sent.com">ahoi@sent.com</a></p>
      <p>© 2026 Jan Zellerhoff · Dortmund, Germany</p>
    </footer>
  </div>

  <script type="module" src="assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Implement `assets/js/main.js`**

```js
import { APPS } from './apps-data.js';
import { STRINGS, detectLang, pick } from './i18n.js';
import { nextOpenState } from './accordion.js';

let currentLang = detectLang(navigator.language);
let openCardId = null;

const grid = document.getElementById('app-grid');
const langToggle = document.getElementById('lang-toggle');

function renderCard(app) {
  const isOpen = openCardId === app.id;

  const card = document.createElement('article');
  card.className = 'app-card' + (isOpen ? ' is-open' : '');
  card.dataset.appId = app.id;

  const summary = document.createElement('button');
  summary.type = 'button';
  summary.className = 'app-card-summary';
  summary.setAttribute('aria-expanded', String(isOpen));
  summary.innerHTML = `
    <img class="app-icon" src="${app.icon}" alt="${app.name} ${pick(STRINGS.iconAlt, currentLang)}" width="48" height="48" loading="lazy">
    <span class="app-summary-text">
      <span class="app-name">${app.name}</span>
      <span class="app-tagline">${pick(app.tagline, currentLang)}</span>
    </span>
    <svg class="chevron" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 7.5L10 12.5L15 7.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  summary.addEventListener('click', () => {
    openCardId = nextOpenState(openCardId, app.id);
    render();
  });

  const details = document.createElement('div');
  details.className = 'app-card-details';

  const detailsInner = document.createElement('div');
  detailsInner.className = 'app-card-details-inner';

  const philosophyEl = document.createElement('p');
  philosophyEl.className = 'app-philosophy';
  philosophyEl.textContent = pick(app.philosophy, currentLang);

  const benefitEl = document.createElement('p');
  benefitEl.className = 'app-benefit';
  benefitEl.textContent = pick(app.benefit, currentLang);

  const shotsWrap = document.createElement('div');
  shotsWrap.className = 'app-screenshots';
  const screenshots = app.screenshots[currentLang] || app.screenshots.en;
  for (const src of screenshots) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${app.name} ${pick(STRINGS.screenshotAlt, currentLang)}`;
    img.loading = 'lazy';
    shotsWrap.appendChild(img);
  }

  const cta = document.createElement(app.storeUrl ? 'a' : 'span');
  if (app.storeUrl) {
    cta.className = 'app-store-button';
    cta.href = app.storeUrl;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.textContent = pick(STRINGS.storeButton, currentLang);
  } else {
    cta.className = 'app-coming-soon';
    cta.textContent = pick(STRINGS.comingSoon, currentLang);
  }

  detailsInner.append(philosophyEl, benefitEl, shotsWrap, cta);
  details.appendChild(detailsInner);
  card.append(summary, details);
  return card;
}

function applyStaticStrings() {
  document.documentElement.lang = currentLang;
  document.documentElement.dataset.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (STRINGS[key]) el.textContent = pick(STRINGS[key], currentLang);
  });
  langToggle.querySelectorAll('.lang-option').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.langOption === currentLang);
  });
}

function render() {
  applyStaticStrings();
  grid.innerHTML = '';
  for (const app of APPS) {
    grid.appendChild(renderCard(app));
  }
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'de' ? 'en' : 'de';
  render();
});

render();
```

- [ ] **Step 3: Serve and manually verify full interactivity in the browser**

Using the same local static server and browser tools as Task 4, check:
- All 5 cards render (Faro, Roll, kept, shin., Vow), all closed initially, in a 2-column grid.
- Click a card: it expands full width with philosophy, benefit, 3 screenshots, and either a store button (Faro/Roll/kept/shin.) or a "Coming soon" label (Vow).
- Click a second card while the first is open: the first closes and the second opens (never two open at once).
- Click the already-open card again: it closes, none are open.
- Click the DE/EN toggle: header text, taglines, philosophy/benefit paragraphs, button labels, and screenshot sets all switch language without a page reload; the currently open card (if any) stays open.
- Click a store button: it opens the correct `apps.apple.com` URL in a new tab.
- Resize to mobile width: 1-column layout, cards still expand/collapse correctly.
- Enable `prefers-reduced-motion` and confirm expand/collapse happens instantly without a grow animation.

Expected: all of the above hold. Fix any issues found in `main.js`/`styles.css` before proceeding.

- [ ] **Step 4: Commit**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
git add index.html assets/js/main.js
git commit -m "Wire dynamic rendering: 5 app cards, single-open accordion, DE/EN toggle"
```

---

### Task 6: Final integration check and wrap-up

**Files:**
- No new files. Verification only.

- [ ] **Step 1: Run the full unit test suite**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
node --test tests/
```

Expected: all tests across `i18n.test.mjs`, `accordion.test.mjs`, `apps-data.test.mjs` PASS.

- [ ] **Step 2: Confirm existing per-app subpages are untouched**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
git status --short faro/ roll/ kept/ shin/
```

Expected: no output (clean, nothing modified in those directories).

- [ ] **Step 3: Verify every internal link on the new page resolves**

With the local static server still running, use the browser tools' network tab (or `preview_network`) to confirm `assets/icons/*.png`, `assets/screenshots/**/*.jpg`, and `assets/css/styles.css` all return 200, and that clicking each store button navigates to the exact URL listed in `apps-data.js`.

- [ ] **Step 4: Final commit**

```bash
cd /Users/jan/Documents/Claude/zllhff.github.io
git status
git add -A
git commit -m "Portfolio landing page: final verification pass" --allow-empty
```

(The `--allow-empty` is a no-op safeguard in case Steps 1-3 found nothing left to change; if they did find fixes, those should already be committed as part of Task 5 Step 4 or as their own fix commit here.)

- [ ] **Step 5: Tell Jan the page is ready and remind him pushing to GitHub is a separate, explicit step**

This plan does not push to `origin` (GitHub Pages goes live on push to the default branch). Report completion and wait for Jan to explicitly ask for the push before running `git push`.
