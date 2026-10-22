import { defineRouting } from 'next-intl/routing';

import { defaultLocale } from './default-locale';
import { locales } from './locales';

/** Cookie that stores the visitor's chosen language. */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * The routing configuration for next-intl.
 *
 * Routes are not prefixed with the locale (no `[locale]` segment). The locale
 * comes from the `NEXT_LOCALE` cookie, resolved in `apps/web/i18n/request.ts`.
 * `defineRouting` provides the locale list and the `Locale` type; the
 * navigation helpers in `./navigation` behave like their `next/navigation`
 * counterparts.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'never',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export function isValidLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' &&
    (routing.locales as readonly string[]).includes(value)
  );
}

/** Returns `value` when it is an enabled locale, otherwise the default. */
export function resolveLocale(value: string | null | undefined): Locale {
  return isValidLocale(value) ? value : routing.defaultLocale;
}
