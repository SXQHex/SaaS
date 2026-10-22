#!/usr/bin/env node
/**
 * Verifies the translation dictionaries of every enabled locale.
 *
 *   pnpm --filter web i18n:check
 *
 * - Every enabled locale must have a folder under `i18n/messages/`.
 * - Keys missing from a locale (compared to English) are reported. They still
 *   render, falling back to English, but they should be translated.
 * - Keys that exist in a locale but not in English are errors (typos / dead keys).
 * - ICU placeholders such as `{page}` must match the English text.
 *
 * Exit code is 1 on errors. Missing keys only fail the run with `--strict`.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(here, 'messages');
const config = JSON.parse(
  readFileSync(
    join(here, '../../../packages/i18n/src/locales.config.json'),
    'utf8',
  ),
);

const REFERENCE = 'en';
const strict = process.argv.includes('--strict');

const flatten = (value, prefix = '') =>
  Object.entries(value).flatMap(([key, child]) =>
    child !== null && typeof child === 'object'
      ? flatten(child, `${prefix}${key}.`)
      : [[`${prefix}${key}`, String(child)]],
  );

const placeholders = (text) =>
  [...text.matchAll(/\{(\w+)\}|<(\w+)\s*\/?>/g)]
    .map((match) => match[1] ?? match[2])
    .sort()
    .join(',');

const load = (locale) => {
  const dir = join(messagesDir, locale);
  const entries = new Map();

  for (const file of readdirSync(dir).filter((name) =>
    name.endsWith('.json'),
  )) {
    const namespace = file.replace(/\.json$/, '');
    const json = JSON.parse(readFileSync(join(dir, file), 'utf8'));

    for (const [key, text] of flatten(json)) {
      entries.set(`${namespace}.${key}`, text);
    }
  }

  return entries;
};

const reference = load(REFERENCE);
let errors = 0;
let missingTotal = 0;

for (const locale of config.enabled) {
  if (!existsSync(join(messagesDir, locale))) {
    console.error(
      `✖ ${locale}: no dictionary folder at i18n/messages/${locale}`,
    );
    errors++;
    continue;
  }

  if (locale === REFERENCE) continue;

  const entries = load(locale);
  const missing = [...reference.keys()].filter((key) => !entries.has(key));
  const unknown = [...entries.keys()].filter((key) => !reference.has(key));
  const mismatched = [...entries.entries()].filter(
    ([key, text]) =>
      reference.has(key) &&
      placeholders(text) !== placeholders(reference.get(key)),
  );

  missingTotal += missing.length;
  errors += unknown.length + mismatched.length;

  const done = reference.size - missing.length;
  console.log(`• ${locale}: ${done}/${reference.size} keys translated`);

  if (missing.length) {
    const namespaces = [...new Set(missing.map((key) => key.split('.')[0]))];
    console.log(
      `  missing ${missing.length} (falls back to English) in: ${namespaces.join(', ')}`,
    );
  }
  for (const key of unknown) console.error(`  ✖ unknown key: ${key}`);
  for (const [key] of mismatched)
    console.error(`  ✖ placeholder mismatch: ${key}`);
}

if (errors > 0 || (strict && missingTotal > 0)) {
  process.exit(1);
}
