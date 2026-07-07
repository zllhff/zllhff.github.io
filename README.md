# zllhff.github.io

Jan Zellerhoff's iOS app legal-hub, served via GitHub Pages at <https://zllhff.github.io/>.

## Struktur

```
zllhff.github.io/
├── index.html              ← App-Gallery (Root) — listet alle aktiven Apps
├── roll/                   ← Roll (Photo Curation) — Brand: Sienna + Cream
│   ├── index.html          ← Landing mit Tagline, Legal-Links, Contact
│   ├── privacy.html        ← EN canonical, mit Lang-Switcher
│   ├── privacy-de.html
│   ├── privacy-es.html
│   ├── privacy-fr.html
│   └── impressum.html
├── shin/                   ← shin. (Personal Awareness) — Brand: Brown + Cream
│   ├── index.html          ← Landing mit Tagline, Legal-Links, Contact
│   ├── privacy.html
│   └── impressum.html
└── (legacy files / kept/ — siehe unten)
```

## Konvention pro App

Jede neue App bekommt ein eigenes Subdir mit:

1. **`<app>/index.html`** — Landing-Page mit
   - Back-Link `← All apps` (zum Root)
   - App-Name als Wordmark im eigenen Brand-Style
   - Tagline (eine Zeile, was die App ist)
   - Kurzer Beschreibungs-Absatz in der App-Brand-Voice
   - Legal-Section mit Links zu Privacy + Impressum
   - Support/Contact-Section mit `ahoi@sent.com`
   - Footer mit © + Impressum-Link
2. **`<app>/privacy.html`** (+ Locale-Varianten, falls App lokalisiert ist)
3. **`<app>/impressum.html`** (DE Pflicht, EN optional als `impressum-en.html`)

Jeder App-Hub fühlt sich wie seine eigene Brand-Surface an (eigene Farben, Typo, Voice), der Root bleibt visuell neutral als Index.

## Konvention am Root

`index.html` ist eine App-Galerie: ein 2-spaltiges Grid (1-spaltig auf Mobile) mit 5 fest hinterlegten Karten (Faro, Roll, Kept, Shin, Vow, in genau dieser Reihenfolge — nicht alphabetisch, sondern Einfüge-Reihenfolge im Datenmodul). Die Seite selbst nimmt sich farblich zurück (neutraler Hintergrund, gedämpfter Header, **kein Personenname** in Titel/Header/Footer); jede Karte trägt die eigene Brand-Sprache ihrer App (Hintergrund, Akzentfarbe, Typografie).

Standardsprache ist **Englisch** (DE/EN-Umschalter oben rechts, kein Reload, keine Browser-Locale-Erkennung). Alle sichtbaren Strings liegen zweisprachig vor.

Die Karten kommen aus `assets/js/apps-data.js`, exportiert als Array `APPS`. Jeder Eintrag hat die Form:

```js
{
  id: 'appname',
  name: 'AppName',
  icon: 'assets/icons/appname.png',
  storeUrl: 'https://apps.apple.com/...' oder null (falls noch nicht live),
  theme: {                       // Brand-Look der Karte + des Modals
    bg, surface, text, muted, accent, buttonText, font,
    fontWeight?, letterSpacing?, // optional (z.B. Kept-Wordmark)
  },
  tagline:    { de, en },
  philosophy: { de, en },
  benefit:    { de, en },
  features:   { de: [3 kurze, sachliche Punkte], en: [...] },
  screenshots:{ de: [3 bis 5 Pfade], en: [3 bis 5 Pfade] },
}
```

Ein Klick auf eine Karte öffnet ein **Modal-Overlay** (dunkler Scrim, in der Brand-Farbe der App) mit Icon, Name, Tagline, Philosophie, Benefit, den drei Features und dem Screenshot-Streifen. Schließen: Klick auf den Scrim, das ×, oder Escape. Ein Klick auf einen Screenshot öffnet ihn als **Lightbox** darüber (Klick daneben schließt nur die Lightbox, das Modal bleibt offen). Die Karte/das Modal verlinkt zum App-Store-Eintrag über `storeUrl` (bzw. zeigt „Coming soon", wenn `storeUrl: null`), **nicht** zu einer `/<app>/`-Subpage.

Der Footer enthält Kontakt-Mail (`ahoi@sent.com`), Copyright und einen Link zu `/impressum.html`.

**Assets:** `assets/css/styles.css`, `assets/js/{i18n,apps-data,main}.js`, `assets/icons/<app>.png`, `assets/screenshots/<app>/{de,en}/{1..5}.jpg`. Icons und die meisten Screenshots werden reproduzierbar aus den App-Repos erzeugt (`scripts/prepare-assets.sh`); Vows Screenshots (inkl. zweier „mode active"-Captures) stammen aus dem Simulator und liegen direkt im Repo. Unit-Tests (`tests/*.test.mjs`, via `node --test tests/*.test.mjs`) prüfen Datenform und Strings.

## Workflow: Neue App hinzufügen

1. **Subdir anlegen:** `mkdir <app>/`
2. **Privacy + Impressum schreiben** (im App-eigenen Brand-Style, mit `ahoi@sent.com` als Contact). Vorlage: `roll/privacy.html` (Roll) oder `shin/privacy.html` (shin).
3. **`<app>/index.html` schreiben** — Landing-Page nach dem Pattern oben. Vorlage: `roll/index.html` (formal-elegant) oder `shin/index.html` (warm-quiet).
4. **Neuen Eintrag im `APPS`-Array in `assets/js/apps-data.js` anlegen** mit `id`, `name`, `icon`, `storeUrl` (oder `null`, falls noch nicht live), `theme` (Brand-Farben + Font der Karte), sowie `tagline`, `philosophy`, `benefit`, `features` (3 kurze, sachliche Punkte) und `screenshots` (3 bis 5) jeweils auf Deutsch und Englisch. Reihenfolge im Array bestimmt die Reihenfolge im Grid (nicht alphabetisch).
5. **Assets erzeugen:** Icon + Screenshots über `scripts/prepare-assets.sh` (Quellpfade dort ergänzen) nach `assets/icons/` bzw. `assets/screenshots/<app>/{de,en}/`. Icons werden über `sips -s format png` re-encodiert (App-Store-/Archive-PNGs sind CgBI-optimiert und rendern sonst nicht im Browser).
6. **Tests:** `node --test tests/*.test.mjs` (Datenform, 3–5 Screenshots, 3 Features, keine Gedankenstriche).
7. **Commit + Push** — GitHub Pages baut nach ~30–120 Sek neu.
8. **Verify:** `curl -I https://zllhff.github.io/<app>/` muss 200 OK zurückgeben.

## ASC-Compliance-Note

Apple's ASC verlangt für jede App:

- **Support-URL** → `https://zllhff.github.io/<app>/` (die Landing-Page)
- **Privacy-Policy-URL** → `https://zllhff.github.io/<app>/privacy.html` (oder Locale-Variante pro App-Sprache in ASC)

Beide müssen **200 OK** sein UND eine echte Landing-Page zeigen (kein 404, kein Orphan-Privacy-File). Falls Support-URL auf ein leeres Subdir zeigt → Apple-Reviewer kann unter Guideline 1.5 / 2.3.7 rejecten. Pre-Submit-Check: Browser auf `https://zllhff.github.io/<app>/` öffnen und prüfen ob Page rendert + Contact-Email findbar.

Cross-Ref: Obsidian → `1. Content/Business/ASC Submission Best Practices.md` (Gotcha-Block „Support-URL muss echte Landing-Page sein").

## Email-Konvention

Alle Apps nutzen projektübergreifend **`ahoi@sent.com`** als Contact-Email (ASC Review Contact, Privacy-Inquiries, Support). Memory-Eintrag im User-Profile. Keine app-spezifischen `hello@<app>.app`-Adressen — die wurden bewusst aufgegeben weil Mailbox-Setup-Overhead pro App + tote Placeholders bei nicht-aktivierten Domains.

## Legacy

- **`kept/`** — alte App „Kept", 2026-05-27 aus dem Root-Index entfernt (Jan-Request). Files bleiben im Subdir (kein hartes Delete) falls die App wieder aufgenommen wird. Nicht aus der Nav verlinkt.
- **`privacy.html`**, **`impressum.html`**, **`imprint.html`**, **`datenschutz.html`** am Root — Jan-Zellerhoff-personal-Developer-Pages, ältere Struktur vor dem Per-App-Subdir-Modell. Bleiben erhalten falls noch von Drittseiten referenziert. Nicht aus der Nav verlinkt.

## GitHub Pages Settings

- Source: `main`-Branch, Root-Verzeichnis
- Custom Domain: keine (zllhff.github.io ist die kanonische URL)
- Build-Time nach Push: typisch 30–90 Sek

## Changelog

- **2026-07-07** — Root-Redesign: App-Galerie neu gebaut. Datengetriebenes Grid (`assets/js/apps-data.js` + `main.js` + `styles.css`), per-App-Brand-Themes, **Modal-Overlay** statt Inline-Accordion, Screenshot-**Lightbox**, 3–5 Screenshots + 3 sachliche Features pro App, Screenshot-Konturen, **EN als Standard**, Personenname entfernt (Titel/Header/Footer), Ort aus Footer entfernt. Vow-Icon auf Post-Rename-Ring korrigiert; zwei „mode active"-Screens (Wald-/Nachthimmel-Welt) aus dem Simulator. Icon-CgBI-Fix. Unit-Tests + jsdom-Smoke-Test. **Per-App-Legal-Subpages (`<app>/privacy*.html`, `<app>/impressum.html`) und Root-Legal-Dateien blieben unangetastet** — sie sind aus den Apps verlinkt.
- **2026-05-28** — Restructure: Root als App-Gallery (statt direkte Legal-Links), per-App-Subpages mit eigenem `index.html` als Landing. `shin/index.html` neu erstellt analog zu `roll/index.html`. Kept aus Nav entfernt. README dokumentiert die Konvention.
- **2026-05-27** — `roll/index.html` neu erstellt (404-Fix für `https://zllhff.github.io/roll/`). Email-Adressen in allen Roll-Legal-Pages auf `ahoi@sent.com` (zentrale Convention).
- **2026-05-20** — Roll Privacy-Pages (EN/DE/ES/FR) + Impressum für ASC-Submission.
- Davor — shin-Privacy/Impressum, Kept-Legal-Pages, Jan-personal-Developer-Pages.
