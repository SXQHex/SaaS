import config from './locales.config.json';

/**
 * Single source of truth for languages: `locales.config.json`.
 *
 * - `enabled`: the languages the app serves right now.
 * - `locales`: metadata registry (including languages that are not enabled
 *   yet, such as `ru` and `ar`), so enabling one is a two-step change:
 *     1. add its code to `enabled`
 *     2. add `apps/web/i18n/messages/<code>/*.json`
 *   Missing keys fall back to English (see `apps/web/i18n/request.ts`)
 *   and `pnpm --filter web i18n:check` reports them.
 */
type LocaleRegistry = Record<
  string,
  { name: string; nativeName: string; bcp47: string; direction: 'ltr' | 'rtl' }
>;

export const localeRegistry: LocaleRegistry = config.locales as LocaleRegistry;

export const locales: string[] = config.enabled.filter(
  (code) => code in localeRegistry,
);

export function getLocaleDirection(locale: string): 'ltr' | 'rtl' {
  return localeRegistry[locale]?.direction ?? 'ltr';
}

export function getLocaleBcp47(locale: string): string {
  return localeRegistry[locale]?.bcp47 ?? locale;
}
