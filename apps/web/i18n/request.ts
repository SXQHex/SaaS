/**
 * App-specific i18n request configuration.
 *
 * The language comes from the `NEXT_LOCALE` cookie (set by `setLocaleAction`
 * in `@kit/i18n/actions`) and falls back to the default locale. Routes are not
 * prefixed with the locale.
 *
 * Namespaces live in separate files under `messages/${locale}/`. Adding a
 * language means adding that folder; keys missing from it fall back to English
 * (the complete reference dictionary), so a half-translated language never
 * shows raw keys.
 */
import { cookies } from 'next/headers';

import { getRequestConfig } from 'next-intl/server';

import { LOCALE_COOKIE_NAME, resolveLocale } from '@kit/i18n/routing';

/** The complete reference dictionary every other locale falls back to. */
const FALLBACK_LOCALE = 'en';

// Define the namespaces to load
const namespaces = [
  'common',
  'auth',
  'account',
  'teams',
  'billing',
  'marketing',
] as const;

const isDevelopment = process.env.NODE_ENV === 'development';

type Messages = Record<string, unknown>;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  const messages = await loadMessagesWithFallback(locale);

  return {
    locale,
    messages,
    timeZone: 'UTC',
    onError(error) {
      if (isDevelopment) {
        // Missing translations are expected and should only log an error
        console.warn(`[Dev Only] i18n error: ${error.message}`);
      }
    },
    getMessageFallback(info) {
      return info.key;
    },
  };
});

/**
 * Loads the fallback locale first and merges the requested locale on top, so
 * any key that has not been translated yet resolves to English.
 */
async function loadMessagesWithFallback(locale: string): Promise<Messages> {
  const fallbackMessages = await loadMessages(FALLBACK_LOCALE);

  if (locale === FALLBACK_LOCALE) {
    return fallbackMessages;
  }

  return deepMerge(fallbackMessages, await loadMessages(locale));
}

/**
 * Loads translation messages for all namespaces.
 * Each namespace is loaded from a separate file for better code splitting.
 */
async function loadMessages(locale: string): Promise<Messages> {
  const loadedMessages: Messages = {};

  await Promise.all(
    namespaces.map(async (namespace) => {
      try {
        const namespaceMessages = await import(
          `./messages/${locale}/${namespace}.json`
        );

        loadedMessages[namespace] = namespaceMessages.default;
      } catch {
        // namespace not translated for this locale: handled by the fallback
        loadedMessages[namespace] = {};
      }
    }),
  );

  return loadedMessages;
}

function isPlainObject(value: unknown): value is Messages {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const current = result[key];

    result[key] =
      isPlainObject(current) && isPlainObject(value)
        ? deepMerge(current, value)
        : value;
  }

  return result;
}
