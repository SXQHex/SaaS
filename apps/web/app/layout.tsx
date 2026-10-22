import { getLocale, getMessages } from 'next-intl/server';

import { getLocaleDirection } from '@kit/i18n/locales';
import { Toaster } from '@kit/ui/sonner';
import { cn } from '@kit/ui/utils';

import { RootProviders } from '~/components/root-providers';
import appConfig from '~/config/app.config';
import { heading, sans } from '~/lib/fonts';
import { generateRootMetadata } from '~/lib/root-metdata';

import '../styles/globals.css';

/**
 * The language comes from the `NEXT_LOCALE` cookie (see `i18n/request.ts`), so
 * the document `lang` and `dir` follow the visitor's choice. `dir` is what
 * switches the whole UI to right-to-left when an RTL language (e.g. Arabic) is
 * enabled; use logical Tailwind utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`,
 * `text-start`, `text-end`) instead of left/right ones so layouts mirror.
 *
 * The theme is resolved on the client: next-themes runs a script before paint
 * to apply the stored theme. `suppressHydrationWarning` is required because it
 * writes the theme class onto `<html>` before React hydrates.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      className={getClassName()}
      suppressHydrationWarning
    >
      <body>
        <RootProviders
          theme={appConfig.theme}
          locale={locale}
          messages={messages}
        >
          {children}

          {/* inside the providers so it can follow next-themes reactively */}
          <Toaster richColors={true} position="top-center" />
        </RootProviders>
      </body>
    </html>
  );
}

function getClassName() {
  const font = [sans.variable, heading.variable].reduce<string[]>(
    (acc, curr) => {
      if (acc.includes(curr)) return acc;

      return [...acc, curr];
    },
    [],
  );

  return cn('bg-background min-h-screen antialiased', ...font);
}

export const generateMetadata = generateRootMetadata;
