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
