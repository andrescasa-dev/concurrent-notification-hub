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

- **Jest** — Configs in `jest/` (`unit.config.cjs`, `e2e.json`, `coverage.config.cjs`); unit tests under `src/**/*.spec.ts`, e2e under `test/` and `src/**/*.e2e-spec.ts`; shared test utilities in `test/utils/`.

### Local services (optional)

- **`docker-compose.yml`** — Postgres 16 for local dev; credentials from env; data in a named volume.

### Authentication

- **Users** — The API can represent people (or accounts) in persistence so behavior can be scoped per identity.
- **Sign-in** — Callers prove who they are; successful sign-in yields a reusable credential the client sends on later requests.
- **Protected routes** — Endpoints that require an authenticated identity reject anonymous access; public endpoints stay available where that matches the product.

How sign-in and credentials are implemented may evolve; the stable idea is **identity, proof, and guarded operations**.

### Versioning and documentation

- **Swagger** — Live docs at `/docs`, driven by decorators.
- **URI versioning** — Default `v1` in the path (`/v1/...`) for stable client URLs.
