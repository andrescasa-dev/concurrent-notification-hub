# Architecture

## Layout

Feature modules live directly under `src/`, one folder per domain or bounded context (idiomatic NestJS). Example: `src/users/`, `src/orders/`.

## Per-module folders

Each feature folder may include:

| Folder       | Role |
|-------------|------|
| `constants` | Fixed values, enums, config keys scoped to the module. |
| `controllers` | HTTP entrypoints (Nest controllers). |
| `dtos` | Request/response DTOs and validation. |
| `entities` | Persistence models (e.g. TypeORM entities). |
| `models` | Domain types and shapes not tied to HTTP or the DB layer. |
| `services` | Application logic and orchestration. |

Use only the folders you need; empty folders are optional (placeholders can stay until code lands).

## App module (exception)

The **`app`** slice is the root wiring layer and does **not** use a feature folder. It stays as flat files next to `main.ts`:

- `src/app.module.ts` — root Nest module; composes feature modules from `src/<name>/`.
- `src/app.controller.ts` — HTTP entrypoints for app-level routes (not under a `controllers/` subfolder).
- `src/app.service.ts` — application logic for those routes (not under a `services/` subfolder).

Feature modules use the folder layout above; only the root app wiring uses this flat placement.

## Root

`src/app.module.ts` composes feature modules. `src/main.ts` bootstraps the app.
