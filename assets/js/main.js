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
