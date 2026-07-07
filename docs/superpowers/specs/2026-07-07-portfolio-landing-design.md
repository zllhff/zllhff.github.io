# Portfolio-Landingpage — Design

**Datum:** 2026-07-07
**Status:** approved (Brainstorming abgeschlossen)

## Ziel

Die bestehende `index.html` auf `zllhff.github.io` (eine simple Textliste) wird ersetzt durch eine
aufklappbare Grid-Übersicht aller iOS-Apps von Jan Zellerhoff: Faro, Roll, Kept, Shin, Vow.

## Design Read

Premium-consumer Portfolio-Landingpage, ruhig/Apple-artig, statisches Vanilla-HTML/CSS/JS
(kein Framework, kein Build-Step — passend zum bestehenden Repo und zu GitHub Pages).
Dials: `VARIANCE 6 / MOTION 4 / DENSITY 3`.

## Hosting

Kein neues Setup. `zllhff.github.io` (Repo `/Users/jan/Documents/Claude/zllhff.github.io`,
Remote `github.com/zllhff/zllhff.github.io`) ist bereits live und hostet pro App schon
Impressum/Datenschutz-Unterseiten. Nur die Root-`index.html` wird ersetzt. Eigene Domain bleibt
optional für später (CNAME nachrüstbar), kein Blocker jetzt.

## Struktur

Eine Seite, kein Scroll-Hijacking, kein Router.

- **Header:** Name „Jan Zellerhoff" + 1-Zeiler-Intro + Sprach-Switch (DE/EN) oben rechts.
- **Grid:** 2-spaltig (Desktop), 1-spaltig (< 768px). 5 Karten, alle gleich groß im
  geschlossenen Zustand (keine künstliche Hierarchie zwischen den Apps). Reihenfolge:
  Faro, Roll, Kept, Shin, Vow. Die letzte Karte (Vow) steht in der letzten Zeile allein — das
  ist beabsichtigt, kein Bug.
- **Footer:** Copyright, Kontakt-Mail (`ahoi@sent.com`), Links zu Impressum (`/impressum.html`).

## Karten-Verhalten

- **Geschlossen:** App-Icon (~56px, abgerundetes Quadrat) oben, App-Name, Tagline (1 Zeile),
  Chevron unten rechts. Dezente Border, kein Schatten-Overkill, einheitlicher Radius über alle
  Karten/Buttons.
- **Öffnen:** Klick auf eine Karte setzt sie auf `grid-column: 1 / -1` (volle Breite) und
  expandiert sie nach unten. **Nur eine Karte gleichzeitig offen** — Klick auf eine zweite
  Karte klappt die erste automatisch zu. Höhen-Transition via CSS Grid (`grid-template-rows`
  0fr → 1fr) statt `max-height`-Hack, damit sie sauber und ohne Sprung animiert.
  `prefers-reduced-motion` degradiert auf sofortiges Ein-/Ausblenden ohne Transition.
- **Aufgeklappter Inhalt** (Reihenfolge):
  1. Philosophie (1 Absatz)
  2. Nutzen (1 Absatz)
  3. 2-3 echte Screenshots (horizontal scrollbarer Strip, `scroll-snap`), Sprache folgt dem
     aktuellen DE/EN-Toggle
  4. App-Store-Button (bzw. bei Vow: „Bald im App Store"-Label statt Button)

## Content pro App

Store-Links (bestätigt von Jan):
- Faro: `https://apps.apple.com/de/app/faro-eine-t%C3%A4gliche-reise/id6785093908`
- Roll: `https://apps.apple.com/de/app/roll-foto-kuration/id6772247083`
- Kept: `https://apps.apple.com/de/app/kept-dokumente-scanner/id6777199188`
- Shin: `https://apps.apple.com/de/app/shin-brich-den-autopilot/id6759466244`
- Vow: noch kein Store-Link (ASC-Einreichung offen, siehe `[[Vow]]` in Obsidian)

Philosophie/Nutzen-Absätze (DE+EN) werden neu geschrieben, nicht 1:1 aus den alten
Privacy-Seiten kopiert (die sind reine Rechtstexte, zu dünn für Marketing-Zweck). Grundlage:
Vault-Notizen (`Business/Faro`, `Business/Roll`, `Business/Kept`, `Business/Shin`,
`Business/Vow`) + bestehende Taglines aus den aktuellen `<app>/index.html`-Dateien im Repo.

**Screenshots (Quelle je App, DE/EN je 2-3 auswählen):**
- Faro: `store_assets/screenshots/{de-DE,en-US}/`
- Kept: `docs/asc/screenshots-raw/iphone69_{en,de}_*.png`
- Roll: `store_assets/screenshots/{de,en}/`
- Shin: `store_assets/screenshots/{de-DE,en-US}/`
- Vow: keine vorhandenen Store-Screenshots. Werden vor Umsetzung frisch aus dem Simulator
  erzeugt (2-3 Screens, aktueller Build in `/Users/jan/Documents/Claude/Still/`).

**App-Icons (Quelle je App, 1024px/beste verfügbare Auflösung):**
- Faro: `Faro/*/Assets.xcassets/AppIcon.appiconset/` (Haupt-App, nicht Watch)
- Kept: `kept app/Filed/Filed/Assets.xcassets/AppIcon-*.appiconset/` (Default-Variante wählen)
- Roll: `roll/src/Roll/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`
- Shin: `shin app/shin/Resources/AlternateIcons/AppIcon-Default@3x.png` (ggf. hochauflösenderes
  Icon im Haupt-Asset-Catalog suchen)
- Vow: `Still/Still/Assets.xcassets/AppIcon.appiconset/icon_light.png` (Light-Variante als
  Standard, matched restliche Icons im Grid)

## Sprache (DE/EN)

Ein `index.html`, JS-Toggle oben rechts, kein Page-Reload. Startwert = Browser-Sprache
(`navigator.language`), Fallback EN. Alle Strings (Header, Taglines, Philosophie, Nutzen,
Button-Labels, Footer) liegen als DE/EN-Paar in einem JS-Objekt; Toggle schreibt
`data-lang="de"|"en"` auf `<html>`, CSS/JS blendet passende Strings ein.

## Visuelle Sprache

- Hintergrund neutral (off-white/off-black), folgt `prefers-color-scheme` (kein manueller
  Dark-Mode-Toggle, System entscheidet).
- Systemschrift (`-apple-system, BlinkMacSystemFont, ...`), wie im Bestand — kein neuer
  Webfont-Ballast.
- Kein page-weiter Marken-Akzent (kein Purple/Blau-Glow). Die 5 App-Icons liefern die Farbe.
- Ein Radius-Wert für Karten, Buttons, Icon-Container (konsistent).
- Kein Emoji, keine Gedankenstriche, keine „Quietly trusted by"-artige KI-Textfloskeln.
- Icons/Buttons: keine Icon-Library nötig (nur ein Chevron/Pfeil als Interaktionselement,
  als Inline-SVG, kein hand-gemaltes Icon-Set).

## Out of Scope

- Kein Umbau der bestehenden Privacy-/Impressum-Unterseiten pro App.
- Keine neue Domain/DNS-Änderung.
- Kein Backend, keine Analytics, kein Formular.
- Keine weiteren Sprachen außer DE/EN auf dieser Übersichtsseite (die einzelnen App-Unterseiten
  behalten ihre bestehenden, teils breiteren Sprachsets für Privacy-Texte unangetastet).

## Testing / Verification

Rein statische Seite ohne Framework — Verifikation über den `preview_start`/Browser-Workflow:
Grid-Layout Desktop+Mobile, Karten-Expand/Collapse (inkl. „nur eine offen"-Regel), DE/EN-Toggle,
Store-Links, Screenshot-Strip-Scroll, Dark-Mode, `prefers-reduced-motion`.
