import en from './en.json';
import ptBr from './pt-br.json';

export const locales = ['en', 'pt-br'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  'pt-br': 'Português (BR)',
};

export const localeShortNames: Record<Locale, string> = {
  en: 'EN',
  'pt-br': 'PT',
};

/** Maps our locale codes to HTML `lang` attribute values. */
export const htmlLang: Record<Locale, string> = {
  en: 'en',
  'pt-br': 'pt-BR',
};

type Dict = Record<string, unknown>;
const dictionaries: Record<Locale, Dict> = {
  en: en as Dict,
  'pt-br': ptBr as Dict,
};

/**
 * Returns a translator `t(key)` that looks up dotted paths in the locale's
 * JSON dictionary. Falls back to the key itself when missing — noisy enough
 * to catch during development without crashing the page.
 */
export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale];
  return function t(key: string): string {
    const value = key
      .split('.')
      .reduce<unknown>((acc, segment) => {
        if (acc && typeof acc === 'object' && segment in (acc as Dict)) {
          return (acc as Dict)[segment];
        }
        return undefined;
      }, dict);
    return typeof value === 'string' ? value : key;
  };
}

/** Extracts the locale from a URL pathname like `/pt-br/docs/intro`. */
export function getLocaleFromUrl(url: URL): Locale {
  const segment = url.pathname.split('/').filter(Boolean)[0];
  return (locales as readonly string[]).includes(segment ?? '')
    ? (segment as Locale)
    : defaultLocale;
}

/** Strips the locale prefix from a pathname; returns '/' for the locale root. */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|pt-br)(\/.*)?$/);
  if (!match) return pathname;
  return match[2] ?? '/';
}
