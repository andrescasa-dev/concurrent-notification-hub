# Read me

**Node 24** (see `engines` in `package.json` and `.nvmrc`). This repo uses **pnpm** only: run `corepack enable`, then `pnpm install`. In CI or deploy images, use `pnpm install --frozen-lockfile`.

## Decisions

### Fundamental setup

- **pnpm** — Fast installs, reproducible lockfile; version pinned in `packageManager` / `engines.pnpm`.
- **Node 24** — LTS; `.nvmrc` aligns with `engines.node`.
- **EditorConfig** — One baseline style so editors don’t fight each other.
- **`.gitignore`** — Keeps build artifacts, deps, secrets, and IDE noise out of git.
- **`.dockerignore`** — Smaller, safer images; skips deps, git, and `.env` in build context.

### Code quality

- **Prettier** — One shared formatter.
- **ESLint** — Lint TypeScript; Prettier integration avoids rule clashes.

### Testing

- **Jest** — Unit (`src/**/*.spec.ts`) and e2e (`test/`).

### Local services (optional)

- **`docker-compose.yml`** — Postgres 16 for local dev; credentials from env; data in a named volume.

### Versioning and documentation

- **Swagger** — Live docs at `/docs`, driven by decorators.
- **URI versioning** — Default `v1` in the path (`/v1/...`) for stable client URLs.
