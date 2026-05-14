# Testing setup

This document describes how automated tests are wired in this NestJS API: where configuration lives, how unit and end-to-end (e2e) runs differ, and what you need locally (especially for e2e against a test database).

## Stack

- **Jest** — test runner.
- **ts-jest** — compiles TypeScript for Jest.
- **@nestjs/testing** — bootstraps Nest applications in tests (see `test/utils/e2e-bootstrap.ts`).
- **supertest** — HTTP assertions against the Nest HTTP server in e2e tests.

## Layout

| Location | Purpose |
| -------- | ------- |
| [`test/jest/unit.config.cjs`](test/jest/unit.config.cjs) | Unit tests only: `rootDir` is `src/`, files match `*.spec.ts`. |
| [`test/jest/e2e.json`](test/jest/e2e.json) | Standalone e2e run: repo root as `rootDir`, files match `*.e2e-spec.ts`. |
| [`test/jest/coverage.config.cjs`](test/jest/coverage.config.cjs) | Single command that runs **two Jest projects** (unit + integration/e2e) and merges coverage. |
| [`test/utils/`](test/utils/) | Shared test utilities used by e2e (env loading, DB global setup, Nest bootstrap, DB truncate). |
| `test/` and `src/**/` | E2e spec files (`*.e2e-spec.ts`) can live under `test/` or next to feature code under `src/`. |

Jest configs live under `test/jest/`. The `.cjs` configs resolve the **repository root** with `path.resolve(__dirname, '../..')` so `coverage/` and test discovery stay correct relative to the repo. The `e2e.json` file sets `"rootDir": "../.."` (relative to `test/jest/`) for the same reason. The whole `test/` tree is excluded from `tsconfig.build.json`, so Nest’s production build does not emit test or Jest config files.

## npm scripts

| Script | What it runs |
| ------ | -------------- |
| `pnpm test` / `pnpm test:unit` | Jest with [`test/jest/unit.config.cjs`](test/jest/unit.config.cjs). |
| `pnpm test:watch` | Same unit config with `--watch`. |
| `pnpm test:e2e` | Jest with [`test/jest/e2e.json`](test/jest/e2e.json), `--runInBand` (serial workers for DB safety). |
| `pnpm test:cov` | Jest with [`test/jest/coverage.config.cjs`](test/jest/coverage.config.cjs), `--coverage`, `--runInBand`. |
| `pnpm test:all` | Unit then e2e (`test` then `test:e2e`). |
| `pnpm test:debug` | Node inspector + Jest on the **unit** config. |

## Unit tests

- **Discovery:** any `*.spec.ts` under `src/`.
- **Environment:** Node.
- **Coverage (when you pass `--coverage` on the unit config):** collects from `src/**/*.(t|j)s`, excluding `migrations/`.

Unit tests do **not** load `.env.test` or run TypeORM global setup; they should mock external systems (e.g. email clients) as needed.

## E2e / integration tests

- **Discovery:** any path matching `*.e2e-spec.ts` from the repo root (e.g. `test/foo.e2e-spec.ts`, `src/auth/auth.e2e-spec.ts`).
- **`setupFiles`:** [`test/utils/load-env-test.ts`](test/utils/load-env-test.ts) runs in each worker and loads [`.env.test`](.env.test) so Nest and validators see the same Postgres and JWT variables as in test runs.
- **`globalSetup`:** [`test/utils/setup.ts`](test/utils/setup.ts) runs **once** before the suite: loads `.env.test`, builds a TypeORM `DataSource`, and **runs all migrations** against the configured database. That database must be dedicated to testing.
- **`maxWorkers: 1`** (in e2e config): avoids parallel workers all hitting the same test database.

Shared helpers:

- **`test/utils/e2e-bootstrap.ts`** — builds a Nest app mirroring production-style pipes, interceptors, and URI versioning; exposes `createHttpAgent` for supertest.
- **`test/utils/truncate.ts`** — `truncateAll(dataSource)` clears test tables between examples where specs opt in.

**Prerequisites for e2e:** copy [`.env.test.example`](.env.test.example) to `.env.test`, point it at a **test** Postgres instance, and ensure the DB is reachable. The first e2e run applies migrations via global setup.

## Coverage (`test:cov`)

[`test/jest/coverage.config.cjs`](test/jest/coverage.config.cjs) uses Jest **`projects`**:

1. **`unit`** — same shape as `test/jest/unit.config.cjs` (specs under `src/`, coverage from `src` with spec/e2e files excluded).
2. **`integration`** — same behaviour as the standalone e2e config (including `setupFiles`, `globalSetup`, single worker), with `collectCoverageFrom` scoped to `src/**/*.ts` so the HTML/lcov report maps to application code.

The e2e block is **duplicated** between `test/jest/e2e.json` and the `integration` project on purpose: one entry point for day-to-day e2e, another for a single combined coverage run without merging incompatible `collectCoverageFrom` defaults across different `rootDir` values.

## Conventions

- **Unit file names:** `*.spec.ts` next to the code under `src/`.
- **E2e file names:** `*.e2e-spec.ts` under `test/` or under `src/` when colocated with a module.
- **Application code language:** English (including comments in test utilities).

For product and architecture context, see [`docs_ia/PROYECT.md`](docs_ia/PROYECT.md) if present in your branch.
