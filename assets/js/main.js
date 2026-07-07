import { APPS } from './apps-data.js';
import { STRINGS, pick } from './i18n.js';

let currentLang = 'en';
let openAppId = null;
let modalEl = null;
let lightboxEl = null;

const grid = document.getElementById('app-grid');
const langToggle = document.getElementById('lang-toggle');

function applyTheme(el, theme) {
  el.style.setProperty('--tile-bg', theme.bg);
  el.style.setProperty('--tile-text', theme.text);
  el.style.setProperty('--tile-muted', theme.muted);
  el.style.setProperty('--tile-accent', theme.accent);
  el.style.setProperty('--tile-button-text', theme.buttonText);
  el.style.setProperty('--tile-font', theme.font);
  if (theme.fontWeight) el.style.setProperty('--tile-name-weight', theme.fontWeight);
  if (theme.letterSpacing) el.style.setProperty('--tile-name-spacing', theme.letterSpacing);
}

function renderCard(app) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'app-card';
  card.dataset.appId = app.id;
  applyTheme(card, app.theme);
  card.innerHTML = `
    <img class="app-icon" src="${app.icon}" alt="${app.name} ${pick(STRINGS.iconAlt, currentLang)}" width="72" height="72" loading="lazy">
    <span class="app-card-text">
      <span class="app-name">${app.name}</span>
      <span class="app-tagline">${pick(app.tagline, currentLang)}</span>
    </span>
  `;
  card.addEventListener('click', () => openModal(app.id));
  return card;
}

function renderGrid() {
  grid.innerHTML = '';
  for (const app of APPS) {
    grid.appendChild(renderCard(app));
  }
}

function buildModalContent(app) {
  const modal = document.createElement('div');
  modal.className = 'app-modal';
  applyTheme(modal, app.theme);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'modal-close';
  closeButton.setAttribute('aria-label', pick(STRINGS.closeModal, currentLang));
  closeButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 2L14 14M14 2L2 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `;
  closeButton.addEventListener('click', closeModal);

  const header = document.createElement('div');
  header.className = 'modal-header';
  header.innerHTML = `
    <img class="modal-icon" src="${app.icon}" alt="${app.name} ${pick(STRINGS.iconAlt, currentLang)}" width="64" height="64" loading="lazy">
    <span class="modal-title">
      <span class="app-name">${app.name}</span>
      <span class="app-tagline">${pick(app.tagline, currentLang)}</span>
    </span>
  `;

  const philosophyEl = document.createElement('p');
  philosophyEl.className = 'modal-philosophy';
  philosophyEl.textContent = pick(app.philosophy, currentLang);

  const benefitEl = document.createElement('p');
  benefitEl.className = 'modal-benefit';
  benefitEl.textContent = pick(app.benefit, currentLang);

  const shotsWrap = document.createElement('div');
  shotsWrap.className = 'modal-screenshots';
  const screenshots = app.screenshots[currentLang] || app.screenshots.en;
  for (const src of screenshots) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${app.name} ${pick(STRINGS.screenshotAlt, currentLang)}`;
    img.loading = 'lazy';
    img.addEventListener('click', () => openLightbox(src, app));
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

  modal.append(closeButton, header, philosophyEl, benefitEl, shotsWrap, cta);
  return modal;
}

function openModal(appId) {
  const app = APPS.find((a) => a.id === appId);
  if (!app) return;
  openAppId = appId;

  modalEl = document.createElement('div');
  modalEl.className = 'modal-scrim';
  modalEl.appendChild(buildModalContent(app));
  modalEl.addEventListener('click', (event) => {
    if (event.target === modalEl) closeModal();
  });

  document.body.appendChild(modalEl);
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalEl) return;
  modalEl.remove();
  modalEl = null;
  openAppId = null;
  document.body.style.overflow = '';
}

function openLightbox(src, app) {
  lightboxEl = document.createElement('div');
  lightboxEl.className = 'lightbox-scrim';
  const img = document.createElement('img');
  img.src = src;
  img.alt = `${app.name} ${pick(STRINGS.enlargedScreenshotAlt, currentLang)}`;
  lightboxEl.appendChild(img);
  lightboxEl.addEventListener('click', (event) => {
    if (event.target === lightboxEl) closeLightbox();
  });
  document.body.appendChild(lightboxEl);
}

function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.remove();
  lightboxEl = null;
}

function applyStaticStrings() {
  document.documentElement.lang = currentLang;
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
  renderGrid();
  if (openAppId) {
    const app = APPS.find((a) => a.id === openAppId);
    const oldModalContent = modalEl.querySelector('.app-modal');
    oldModalContent.replaceWith(buildModalContent(app));
  }
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'de' ? 'en' : 'de';
  render();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (lightboxEl) closeLightbox();
  else if (modalEl) closeModal();
});

render();
