# CLAUDE.md — zllhff.github.io

> Diese Datei wird automatisch geladen wenn Claude Code in `/Users/jan/Documents/Claude/zllhff.github.io/` operiert.
>
> **Was ist das?** Jan Zellerhoff's iOS App Legal-Hub, served via GitHub Pages auf <https://zllhff.github.io/>. Ein Repo, mehrere Apps, eine kanonische Stelle für App-Landing + Privacy + Impressum.

---

## Projekt-Kontext

- **Live-URL:** <https://zllhff.github.io/>
- **GitHub-Remote:** `https://github.com/zllhff/zllhff.github.io.git`
- **Pages-Source:** `main`-Branch, Root-Verzeichnis (kein Jekyll-Build, plain HTML)
- **Build-Time nach Push:** typisch 30–90 Sek bis live
- **Aktive Apps:** [[Roll]], [[shin]] (jeweils eigenes Subdir)
- **Aktive Legal-Pages pro App:** Privacy (+ Locale-Varianten), Impressum

**Two-Layer-Verknüpfung:**

- **Strategie & Brand-Voice pro App** → Obsidian (`1. Content/Business/<App>/`)
- **ASC-Submission-Best-Practices** → Obsidian (`1. Content/Business/ASC Submission Best Practices.md`)
- **Implementation (HTML, Styling, Deploy)** → hier

---

## Struktur — Single Source of Truth

```
zllhff.github.io/
├── CLAUDE.md               ← diese Datei (Claude-Konventionen)
├── README.md               ← Menschen-Doku (Struktur, Workflow, Changelog)
├── index.html              ← Root: App-Gallery, neutraler Style
├── <app>/                  ← pro App ein Subdir
│   ├── index.html          ← App-Landing, eigener Brand-Style
│   ├── privacy.html        ← EN canonical
│   ├── privacy-<locale>.html  ← optionale Locales (de/es/fr/it/ja/…)
│   └── impressum.html      ← DE Pflicht-Form
└── (Legacy — nicht aus Nav verlinkt: kept/, root privacy.html etc.)
```

Detail-Pattern + Workflow + Changelog → [README.md](README.md).

---

## MUST — strikte Regeln

### Email-Konvention
- **Contact-Email projektübergreifend = `ahoi@sent.com`.** Immer. Für Privacy, Impressum, Landing-Page, Footer, mailto-Links, Apple Review Contact, Support. Keine app-spezifischen `hello@<app>.app`-Adressen — die wurden bewusst aufgegeben (Mailbox-Setup-Overhead, tote Placeholders bei nicht-registrierten Domains).
- **Bei neuen Apps:** `ahoi@sent.com` vom ersten Commit an verwenden, nicht erst „TODO später Mailbox-aktivieren".
- **Beim Auditen alter Pages:** wenn `hello@<irgendwas>` gefunden → ersetzen mit `ahoi@sent.com`.

### Pro-App-Subdir-Pattern
Jede neue App bekommt ein eigenes Subdir mit DREI Dateien minimum:

1. **`<app>/index.html`** — Landing-Page (siehe „Landing-Page-Template" unten)
2. **`<app>/privacy.html`** — Privacy Policy EN canonical
3. **`<app>/impressum.html`** — DE Impressum nach §5 TMG

Keine andere Struktur. Keine Direkt-Links auf Privacy/Impressum vom Root — die leben auf den App-Subpages.

### Root-Gallery-Pattern
- Root `index.html` ist eine **App-Gallery** — Cards pro App, jede Card linkt auf `/<app>/` (das App-Landing).
- Root ist neutral in Style (kein App-spezifisches Branding), nutzt das `fafafa`-Background + `1a1a1a`-Foreground-Schema.
- Cards alphabetisch sortiert nach App-Name.
- Heading: „Jan Zellerhoff / iOS App Developer".
- Footer: `© <Jahr> Jan Zellerhoff · Dortmund, Germany`.

### Per-App-Brand-Style
- Jede App-Landing nutzt ihren eigenen Brand-Style (Farben, Typo, Voice).
- Roll = Sienna `#C6502D` + Cream `#FAF7F2`, sans-serif, prosaisch-elegant
- shin = Brown `#8b4513` + Warm-Cream `#f5f4f0`, kompakter, quiet-tone
- Privacy + Impressum + Landing einer App müssen visuell zusammenhängen (gleiche Palette, gleiche Typo). Wenn neuer App-Style: erst Style-Tokens festlegen, dann alle drei Files konsistent.

### ASC-Compliance — vor jedem Submit-für-die-Apple-Review checken

- [ ] `https://zllhff.github.io/<app>/` → 200 OK (curl + Browser-Check)
- [ ] `https://zllhff.github.io/<app>/privacy.html` (+ Locales) → alle 200 OK
- [ ] `https://zllhff.github.io/<app>/impressum.html` → 200 OK
- [ ] Landing-Page enthält `ahoi@sent.com` als sichtbaren mailto-Link
- [ ] Landing-Page enthält Links zu Privacy + Impressum
- [ ] Brand-Look der Pages konsistent mit der App selbst

Wenn eine URL 404 zurückgibt → potentielles Apple-Reject unter Guideline 1.5 / 2.3.7 (siehe Obsidian-Doc `ASC Submission Best Practices` → Gotcha „Support-URL muss echte Landing-Page sein").

---

## NEVER — Anti-Patterns

- ❌ **`hello@<app>.app`-Adressen** (oder andere app-spezifische Email-Domains) — projektübergreifend gilt nur `ahoi@sent.com`.
- ❌ **Direkte Privacy/Impressum-Links am Root** — die müssen über die App-Landing erreichbar sein.
- ❌ **App-Subdir ohne `index.html`** — wenn nur Privacy + Impressum drin liegen, gibt `https://zllhff.github.io/<app>/` einen 404 zurück und Apple-Reviewer kann unter 1.5 rejecten.
- ❌ **Build-Tools / Jekyll / Webpack** — das hier ist plain HTML, served direkt von GitHub Pages. Keine Build-Pipeline einführen ohne starken Grund.
- ❌ **JavaScript-Tracking** auf Legal-Pages — keine Analytics-Scripts, kein Google-Fonts-CDN (DSGVO-Risiko), keine Third-Party-Libs. System-Font-Stack reicht.
- ❌ **Force-Push auf `main`** — GitHub Pages baut die Live-Site daraus, ein bad-state-push macht alle App-Listings kaputt.
- ❌ **Commits ohne Co-Authorship-Tag** wenn Claude Code beteiligt war (`Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`).

---

## Landing-Page-Template (`<app>/index.html`)

Pflicht-Komponenten in dieser Reihenfolge:

1. **Back-Link** `← All apps` zum Root (`href="/"`)
2. **App-Wordmark** als Heading im eigenen Brand-Style
3. **Tagline** (eine Zeile, was die App ist) — sollte sich mit dem App Store-Subtitle decken oder kompatibel sein
4. **Kurzer Beschreibungs-Absatz** in der App-Brand-Voice — 2–3 Sätze max
5. **Legal-Section** mit Links zu:
   - Privacy Policy (alle Locales falls App lokalisiert ist)
   - Impressum / Imprint
   - Optional: Apple Standard EULA Link `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`
6. **Support & Contact-Section** mit `mailto:ahoi@sent.com`
7. **Footer** mit `© <Jahr> Jan Zellerhoff · Dortmund, Germany · <a href="impressum.html">Impressum</a>`

**Style-Constraint:** brand-coherent, max 720px Content-Width, system-font-stack, kein Tracking-Code.

**Vorlagen:**
- Formal-elegant: [roll/index.html](roll/index.html)
- Warm-quiet: [shin/index.html](shin/index.html)

---

## Workflow: Neue App hinzufügen (Checkliste)

1. **Brand-Style klären** — Farben (Primary + Background + Foreground), Typo, Voice. Aus dem Obsidian-Brand-Identity-Doc der App entnehmen.
2. **Subdir anlegen:** `mkdir <app>/`
3. **`<app>/privacy.html`** schreiben in App-Brand-Style. Inhalt: GDPR-konformes Privacy-Statement. Vorlage: `roll/privacy.html` (EN canonical mit Lang-Switcher) oder `shin/privacy.html` (single-locale).
4. **`<app>/impressum.html`** schreiben — §5 TMG-konform mit Jan's Daten (Dortmund) + `ahoi@sent.com`.
5. **Lokalisierte Privacy-Varianten** falls App in mehreren Sprachen geshipped wird (`privacy-de.html`, `privacy-es.html`, …).
6. **`<app>/index.html`** schreiben nach Landing-Page-Template oben.
7. **Im Root `index.html`** eine neue App-Card hinzufügen, alphabetisch einsortieren.
8. **Local Browser-Check:** alle 4 (oder mehr) Files lokal mit `open <app>/index.html` öffnen, jeden Link prüfen.
9. **Commit + Push** mit Co-Authorship-Tag.
10. **Nach 60–120 Sek Live-Check:**
    ```bash
    for url in "/<app>/" "/<app>/privacy.html" "/<app>/impressum.html"; do
      printf "%-40s " "$url"
      curl -s -o /dev/null -w "%{http_code}\n" "https://zllhff.github.io$url"
    done
    ```
    Alle müssen 200 zurückgeben.
11. **ASC-URLs aktualisieren** in App Store Connect:
    - Support URL → `https://zllhff.github.io/<app>/`
    - Privacy Policy URL → `https://zllhff.github.io/<app>/privacy.html` (oder Locale-Variante pro App-Sprache)

---

## Workflow: Existierende App-Page bearbeiten

1. **Identifizieren** welche File(s) betroffen sind. Typische Cases:
   - Privacy-Text-Update → `<app>/privacy.html` (+ Locale-Varianten)
   - Email-Adresse ändern → alle `<app>/*.html` (search & replace)
   - Brand-Style-Update → erst Tokens definieren, dann konsistent über `index.html` + `privacy.html` + `impressum.html` ausrollen
2. **Edit lokal** mit `Edit`-Tool. Bei Multi-File-Replacements: `sed -i ''` über `find ... -name "*.html"`.
3. **Browser-Spot-Check** lokal.
4. **Commit + Push.**
5. **Live verifizieren** mit curl + Browser nach 60–120 Sek.

---

## Workflow: App archivieren / aus Nav entfernen

Wenn eine App nicht mehr aktiv ist (z.B. Kept, Mai 2026):

1. **Card aus dem Root `index.html` entfernen.**
2. **Subdir BEHALTEN** (kein `rm -rf <app>/`) — falls die App reaktiviert wird oder Drittseiten noch verlinken.
3. **In README's „Legacy"-Section dokumentieren.**
4. **Commit-Message:** „remove <app> from nav".

Falls die App definitiv obsolet ist (z.B. Bundle-ID nie wieder genutzt): erst nach 12+ Monaten Subdir wirklich löschen, und dann mit redirect-meta oder einer Tombstone-Page der Form „This app is no longer available."

---

## Deploy-Spezifika

- **Keine Build-Pipeline.** GitHub Pages serviert die Files direkt aus dem Repo. HTML/CSS inline, kein Webpack, kein Jekyll, kein Sass.
- **Custom Domains:** aktuell keine. Falls in Zukunft `roll.app` oder `shin.app` als Custom-Domain eingerichtet wird → CNAME-File hinzufügen + DNS konfigurieren + diese Doku updaten.
- **HTTPS:** automatisch von GitHub Pages erzwungen, kein Setup nötig.
- **Cache-Bust:** GitHub Pages cached aggressive (~10 Min Edge-TTL). Bei dringenden Live-Fixes: nach Push kurz warten, dann `curl -H "Cache-Control: no-cache"` oder Browser-Hard-Reload zum Verifizieren.

---

## Verknüpfungen

- **README.md** — Menschen-lesbare Doku, Struktur-Beschreibung, Changelog
- **Obsidian: `1. Content/Business/ASC Submission Best Practices.md`** — Cross-Projekt-Lessons aus Apple-Rejections, inkl. Support-URL-Gotcha
- **Obsidian: `1. Content/Business/Roll/`** — Roll Brand-Identity, ASO, Roadmap
- **Obsidian: `1. Content/Business/Shin/`** — shin. Brand, Marketing
- **Roll Dev-Repo:** `/Users/jan/Documents/Claude/roll/` — Roll-Source-Code + ASC-Doku
- **Skill „obsidian-workflow":** Jan's Vault-Regelwerk für die Obsidian-Seite
- **Skill „asc-submission-health":** ASC-Validierungs-Workflow vor Submit

---

## Changelog dieser Datei

- **2026-05-28** — Erstanlage. Reflektiert die Restructure von heute (Root als App-Gallery, per-App-Subpages mit Landing). Conventions, Workflows, Anti-Patterns dokumentiert. Email-Konvention `ahoi@sent.com` zentral festgehalten.
