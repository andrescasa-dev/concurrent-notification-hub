---
name: nestjs-envalid-env
description: Standardizes environment variables in NestJS with envalid and nestjs-envalid so configuration is validated once at startup. Use when adding or changing env vars, wiring TypeORM or other modules, or when the user might duplicate manual process.env checks.
disable-model-invocation: true
---

# Environment variables in NestJS (envalid)

## Single source of truth

Validate and type environment variables only in the **envalid** spec (e.g. `environmentSpecs` in `src/config/config.ts` wrapped with `makeValidators` for `EnvalidModule`).

After `EnvalidModule.forRoot` runs, **do not** re-validate the same keys in `useFactory` functions, services, or config helpers. The injected `Config` (via `ENVALID`) is already complete and safe to use.

## Normalization

Do **not** call `.trim()`, regex cleanup, or other string mangling at consumption sites (TypeORM factories, `data-source.ts`, services). If values must be trimmed or transformed, express that in the **envalid** validators (e.g. custom parser / `makeValidator`) so behavior stays one place.

## Nest application

- Register `EnvalidModule.forRoot({ validators, useDotenv: true, isGlobal: true })` in the root module.
- Inject with `@Inject(ENVALID) private readonly env: Config` or `useFactory: (env: Config) => ...` with `inject: [ENVALID]`.

## Outside Nest (CLI, scripts)

Use the **same** validator object with `cleanEnv(process.env, environmentSpecs)` so CLI tools match runtime rules.

## Anti-pattern

Duplicating checks such as “if missing POSTGRES_HOST throw …” next to envalid — unnecessary and drifts from the spec.
