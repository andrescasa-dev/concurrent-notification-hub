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

- **Jest** — Configs in `test/jest/` (`unit.config.cjs`, `e2e.json`, `coverage.config.cjs`); unit tests under `src/**/*.spec.ts`, e2e under `test/` and `src/**/*.e2e-spec.ts`; shared test utilities in `test/utils/`.

### Local services (optional)

- **`docker-compose.yml`** — Postgres 16 for local dev; credentials from env; data in a named volume. The file sets Compose **`name: thc-mentoria-notifications-dev`**, so this stack is its own project (network, resources) separate from the test database.
- **`docker-compose.test.yml`** — Ephemeral Postgres 16 on host port **5433** for e2e / local test runs (fixed `test` / `test` / `thc_test`). It uses **`name: thc-mentoria-notifications-test`**, so `docker compose -f docker-compose.test.yml down` (even with `--remove-orphans`) does **not** tear down the dev Postgres from the default compose file.

Typical commands: `docker compose up -d` for dev; `docker compose -f docker-compose.test.yml up -d` for test. You do not need a `-p` flag unless you want to override the project name.

### Authentication

- **Users** — The API can represent people (or accounts) in persistence so behavior can be scoped per identity.
- **Sign-in** — Callers prove who they are; successful sign-in yields a reusable credential the client sends on later requests.
- **Protected routes** — Endpoints that require an authenticated identity reject anonymous access; public endpoints stay available where that matches the product.

How sign-in and credentials are implemented may evolve; the stable idea is **identity, proof, and guarded operations**.

### Versioning and documentation

- **Swagger** — Live docs at `/docs`, driven by decorators.
- **URI versioning** — Default `v1` in the path (`/v1/...`) for stable client URLs.
