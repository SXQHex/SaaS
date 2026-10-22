'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { useLocale } from 'next-intl';

import { setLocaleAction } from '@kit/i18n/actions';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shadcn/select';

interface LanguageSelectorProps {
  locales?: string[];
  onChange?: (locale: string) => unknown;
}

/** Each language is shown in its own language (e.g. "Türkçe", "English"). */
function getNativeName(locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(locale);
  } catch {
    return locale;
  }
}

export function LanguageSelector({
  locales = [],
  onChange,
}: LanguageSelectorProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const [value, setValue] = useState(currentLocale);
  const [, startTransition] = useTransition();

  const names = useMemo(
    () =>
      Object.fromEntries(
        locales.map((locale) => [locale, getNativeName(locale) ?? locale]),
      ),
    [locales],
  );

  const languageChanged = useCallback(
    (locale: string | null) => {
      if (!locale) return;

      setValue(locale);

      if (onChange) {
        onChange(locale);
      }

      startTransition(async () => {
        await setLocaleAction(locale);
        router.refresh();
      });
    },
    [onChange, router],
  );

  if (locales.length <= 1) {
    return null;
  }

  return (
    <Select value={value} onValueChange={languageChanged}>
      <SelectTrigger data-test="language-selector">
        <SelectValue className="capitalize">
          {(value) => (value ? (names[value] ?? value) : value)}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {locales.map((locale) => (
          <SelectItem
            value={locale}
            key={locale}
            className="capitalize"
            data-test={`language-option-${locale}`}
          >
            {names[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
