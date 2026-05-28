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

`index.html` zeigt eine Liste der aktiven Apps — pro App eine Card:

- App-Name (groß)
- Tagline (eine Zeile)
- Pfeil → `/app-subdir/`

**Keine direkten Privacy/Impressum-Links am Root.** Die leben auf den Subpages, damit die Per-App-Surface die volle Hoheit über ihre Legal-Doku hat (eigener Brand-Look, eigene Locale-Varianten).

## Workflow: Neue App hinzufügen

1. **Subdir anlegen:** `mkdir <app>/`
2. **Privacy + Impressum schreiben** (im App-eigenen Brand-Style, mit `ahoi@sent.com` als Contact). Vorlage: `roll/privacy.html` (Roll) oder `shin/privacy.html` (shin).
3. **`<app>/index.html` schreiben** — Landing-Page nach dem Pattern oben. Vorlage: `roll/index.html` (formal-elegant) oder `shin/index.html` (warm-quiet).
4. **Im Root `index.html` Card hinzufügen** mit App-Name + Tagline + Link zu `/<app>/`. Alphabetisch einsortieren.
5. **Commit + Push** — GitHub Pages baut nach ~30–120 Sek neu.
6. **Verify:** `curl -I https://zllhff.github.io/<app>/` muss 200 OK zurückgeben.

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

- **2026-05-28** — Restructure: Root als App-Gallery (statt direkte Legal-Links), per-App-Subpages mit eigenem `index.html` als Landing. `shin/index.html` neu erstellt analog zu `roll/index.html`. Kept aus Nav entfernt. README dokumentiert die Konvention.
- **2026-05-27** — `roll/index.html` neu erstellt (404-Fix für `https://zllhff.github.io/roll/`). Email-Adressen in allen Roll-Legal-Pages auf `ahoi@sent.com` (zentrale Convention).
- **2026-05-20** — Roll Privacy-Pages (EN/DE/ES/FR) + Impressum für ASC-Submission.
- Davor — shin-Privacy/Impressum, Kept-Legal-Pages, Jan-personal-Developer-Pages.
