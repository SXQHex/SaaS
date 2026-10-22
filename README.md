# FESaas

FtkSaaS için web arayüzü (Next.js, Supabase, Turborepo monorepo).

- Başlangıç iskeleti: [Makerkit lite](https://github.com/makerkit/nextjs-saas-starter-kit-lite) (MIT, bkz. `LICENSE`).
- Backend: [FtkSaaS](https://github.com/SXQHex/FtkSaaS) (henüz bu depoya alınmadı).
- Diller: `tr` (varsayılan), `en`. Bkz. [docs/i18n.md](docs/i18n.md).

## Gereksinimler

- Node.js 24.19.x (`.nvmrc`), pnpm 11
- Docker (yerel Supabase için)

## Başlangıç

```bash
pnpm install
cp apps/web/.env apps/web/.env.local   # yerel ayarlar; commit edilmez
pnpm run dev
```

Gizli anahtarlar (`SUPABASE_SERVICE_ROLE_KEY` vb.) yalnızca `.env.local`
veya `.env.development` gibi commit edilmeyen dosyalarda tutulur.

## Komutlar

```bash
pnpm run typecheck
pnpm run lint
pnpm --filter web i18n:check   # çeviri sözlüklerini denetler
```
