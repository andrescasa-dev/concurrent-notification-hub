# Architecture

## Layout

Application code lives under `src/modules/<name>/`, one folder per feature module.

## Per-module folders

Each module may include:

| Folder       | Role |
|-------------|------|
| `constants` | Fixed values, enums, config keys scoped to the module. |
| `controllers` | HTTP entrypoints (Nest controllers). |
| `dtos` | Request/response DTOs and validation. |
| `entities` | Persistence models (e.g. TypeORM entities). |
| `models` | Domain types and shapes not tied to HTTP or the DB layer. |
| `services` | Application logic and orchestration. |

Use only the folders you need; empty folders are optional (placeholders can stay until code lands).

## Root

`src/app.module.ts` composes feature modules. `src/main.ts` bootstraps the app.
