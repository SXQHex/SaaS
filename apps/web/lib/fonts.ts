import { Inter as SansFont } from 'next/font/google';

/**
 * @sans
 * @description Define here the sans font.
 * By default, it uses the Inter font from Google Fonts.
 *
 * Subsets follow the enabled languages (see `@kit/i18n` locales.config.json):
 * - `latin-ext` carries the Turkish letters ş, ğ, İ, ı (and Spanish/Polish etc.)
 * - when Russian or Ukrainian are enabled, add `cyrillic` (and `cyrillic-ext`)
 * - Inter has no Arabic glyphs: when Arabic is enabled, add an Arabic font
 *   (e.g. Noto Sans Arabic) and apply it for `dir="rtl"`
 */
const sans = SansFont({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
});

/**
 * @heading
 * @description Define here the heading font.
 */
const heading = sans;

// we export these fonts into the root layout
export { sans, heading };
