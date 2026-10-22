import config from './locales.config.json';

/**
 * @name defaultLocale
 * @description The default locale of the application. Comes from
 * `locales.config.json`; `NEXT_PUBLIC_DEFAULT_LOCALE` can override it per
 * environment as long as the value is an enabled locale.
 */
const override = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;

export const defaultLocale: string =
  override && config.enabled.includes(override) ? override : config.default;
