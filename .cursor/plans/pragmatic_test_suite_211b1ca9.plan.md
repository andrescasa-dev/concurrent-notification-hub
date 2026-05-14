---
name: Pragmatic Test Suite
overview: "Suite minimalista: 4 archivos, ~22 casos, que cubren las piezas con lógica real (XSS escaping, discriminador de DTO) y los flujos HTTP completos con base de datos real. SMS y push strategies, repositorios, y servicios de delegación quedan cubiertos de forma indirecta por los tests e2e."
todos:
  - id: setup-docker
    content: "Create docker-compose.test.yml with postgres-test service on port 5433 (ephemeral, no volume)"
    status: pending
  - id: setup-env
    content: "Create .env.test with NODE_ENV=test, POSTGRES_HOST=localhost, POSTGRES_HOST_PORT=5433, POSTGRES_DB=thc_test, POSTGRES_USER, POSTGRES_PASSWORD, JWT_SECRET=test-secret, JWT_EXPIRES_IN=1d"
    status: pending
  - id: setup-jest-e2e
    content: "Update test/jest-e2e.json to load .env.test via globalSetup and add runInBand:true for DB isolation"
    status: pending
  - id: setup-global-setup
    content: "Create test/setup.ts — global setup that loads .env.test, creates a TypeORM DataSource and runs all migrations on the test DB"
    status: pending
  - id: setup-truncate
    content: "Create test/truncate.ts — helper that exports truncateAll(dataSource) running TRUNCATE users, notifications RESTART IDENTITY CASCADE"
    status: pending
  - id: setup-scripts
    content: "Add test:unit and test:e2e scripts to package.json"
    status: pending
  - id: unit-email-strategy
    content: "Write src/notifications/strategies/email-notification.strategy.spec.ts (4 cases: happy path, htmlBody structure, XSS escaping, wrong channel guard)"
    status: pending
  - id: unit-dto
    content: "Write src/notifications/dtos/create-notification.dto.spec.ts (5 cases: 3 valid channels pass, email with phone recipient fails, sms with 161-char content fails)"
    status: pending
  - id: e2e-auth-users
    content: "Write test/auth-users.e2e-spec.ts (5 cases: register, duplicate email 409, login OK, login wrong password 401, GET /users/me)"
    status: pending
  - id: e2e-notifications
    content: "Write test/notifications.e2e-spec.ts (8 cases: create per channel, 401 without token, ownership isolation on GET, PATCH own vs other, DELETE own)"
    status: pending
isProject: false
---

# Pragmatic Test Suite

## Setup — infraestructura de tests

Esta rama no tiene la infraestructura de tests. Hay que crearla antes de escribir cualquier spec.

### `docker-compose.test.yml` (nuevo archivo en la raíz)

Servicio `postgres-test` independiente del dev DB:

- Image: `postgres:16-alpine`
- Puerto host: `5433` (evita colisión con dev en `5432`)
- Sin volumen persistente — efímero por diseño
- Variables de entorno hardcodeadas para tests (no depende de `.env`)

```yaml
services:
  postgres-test:
    image: postgres:16-alpine
    container_name: thc-postgres-test
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: thc_test
```

### `.env.test` (nuevo archivo en la raíz)

Cargado por el `globalSetup` antes de que arranquen los tests e2e:

```
NODE_ENV=test
POSTGRES_HOST=localhost
POSTGRES_HOST_PORT=5433
POSTGRES_DB=thc_test
POSTGRES_USER=test
POSTGRES_PASSWORD=test
JWT_SECRET=test-secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=
PORT=3001
```

> `.env.test` no contiene secretos reales; los valores son únicamente para la DB de test local/CI.

### `test/setup.ts` — global setup (nuevo archivo)

Se ejecuta **una sola vez antes de toda la suite e2e**. Su función:

1. Llama a `dotenv.config({ path: '.env.test' })` para poblar `process.env`.
2. Crea un `DataSource` TypeORM apuntando a la DB de test (reutilizando `environmentSpecs` de `src/config/config.ts`).
3. Llama a `dataSource.runMigrations()` para dejar el esquema listo.
4. Cierra la conexión.

```typescript
// test/setup.ts
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'node:path';
import { cleanEnv } from 'envalid';
import { environmentSpecs } from '../src/config/config';
import { User } from '../src/users/entities/user.entity';
import { Notification } from '../src/notifications/entities/notification.entity';

export default async function globalSetup() {
  dotenv.config({ path: '.env.test' });
  const env = cleanEnv(process.env, environmentSpecs);
  const ds = new DataSource({
    type: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_HOST_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    entities: [User, Notification],
    migrations: [join(__dirname, '../src/migrations/*.{ts,js}')],
  });
  await ds.initialize();
  await ds.runMigrations();
  await ds.destroy();
}
```

### `test/truncate.ts` — helper de limpieza (nuevo archivo)

Usado en `afterEach` de cada test e2e para garantizar aislamiento entre casos:

```typescript
// test/truncate.ts
import { DataSource } from 'typeorm';

export async function truncateAll(dataSource: DataSource): Promise<void> {
  await dataSource.query(
    'TRUNCATE users, notifications RESTART IDENTITY CASCADE',
  );
}
```

### Cambios en `test/jest-e2e.json`

El archivo actual (`test/jest-e2e.json`) no tiene `globalSetup` ni `runInBand`. Hay que actualizarlo:

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "globalSetup": "<rootDir>/setup.ts",
  "runInBand": true
}
```

- `globalSetup` ejecuta las migraciones antes de la suite.
- `runInBand` garantiza que los tests corran en serie para evitar condiciones de carrera en la DB.

### Scripts en `package.json`

Agregar junto al `test:e2e` existente:

```json
"test:unit": "jest",
"test:e2e": "jest --config ./test/jest-e2e.json"
```

> `test:e2e` ya existe pero no apunta al `jest-e2e.json` actualizado. Confirmar que el script existente usa `./test/jest-e2e.json`.

### Flujo para ejecutar los tests

```
# 1. Levantar la DB de test (solo una vez, se puede dejar corriendo)
docker compose -f docker-compose.test.yml up -d

# 2. Tests unitarios (no necesitan DB)
pnpm test:unit

# 3. Tests e2e (necesitan la DB levantada)
pnpm test:e2e

# 4. Bajar la DB cuando ya no se necesite
docker compose -f docker-compose.test.yml down
```

---

## Principio guía

> Testear lógica real, no que TypeORM hace `findOne` o que Nest inyecta dependencias.

Hay dos tipos de código en esta app:

- **Lógica propia** (escaping XSS, discriminador DTO, ownership en DB) → merece test directo.
- **Delegación/plumbing** (UsersService, SmsStrategy, PushStrategy, repositorios simples) → queda cubierta de forma indirecta por los tests e2e.

## Qué NO se escribe (y por qué)

- `notifications.service.spec.ts` → el servicio solo orquesta; los errores que lanza se validan en e2e.
- `sms-notification.strategy.spec.ts` / `push-notification.strategy.spec.ts` → wrappers de 3 líneas sin lógica propia.
- `users.service.spec.ts` / `auth.service.spec.ts` → delegación a repositorio + bcrypt, cubierto por e2e login.
- `user.entity.spec.ts` → el `@BeforeInsert` se verifica implícitamente al registrar un usuario en e2e.
- `users.repository.integration-spec.ts` / `notifications.repository.integration-spec.ts` → cubiertos por los tests HTTP.

---

## Los 4 archivos

### 1. `src/notifications/strategies/email-notification.strategy.spec.ts`

**Por qué existe:** `buildTemplate` + `escapeHtml` son la única lógica de dominio en las estrategias. Un XSS que se cuele silenciosamente es el tipo de bug que no aparece en e2e.

Mock: `IEmailClient` (jest.fn).

Casos (~4):

- `send()` llama a `emailClient.send()` con `{ to, subject, htmlBody }` correctos.
- `htmlBody` contiene `<h1>` con el título y `<p>` con el contenido.
- Caracteres `<`, `>`, `&`, `"` en título/contenido son escapados (`&lt;`, `&gt;`, `&amp;`, `&quot;`).
- `send()` lanza `BadRequestException` si `dto.channel !== 'email'`.

### 2. `src/notifications/dtos/create-notification.dto.spec.ts`

**Por qué existe:** el discriminador `@Type()` de `create-notification.dto.ts` es código no trivial; si se rompe, validaciones de un canal corren sobre el DTO de otro y los errores son silenciosos.

Sin mocks — usa `plainToInstance` + `validate` de `class-transformer`/`class-validator` directamente.

Casos (~5):

- Payload email válido → `validate()` retorna array vacío.
- Payload sms válido → `validate()` retorna array vacío.
- Payload push válido → `validate()` retorna array vacío.
- `channel: 'email'` + recipient con formato de teléfono (no email) → falla validación `CreateEmailDto`.
- `channel: 'sms'` + `content` de 161 chars → falla validación `CreateSmsDto`.

### 3. `test/auth-users.e2e-spec.ts`

**Por qué existe:** cubre registro, login, perfil y duplicado de email. El `@BeforeInsert` de `bcrypt` se valida aquí de forma implícita (login funciona solo si el hash fue correcto).

Usa `AppModule` + supertest + test DB (infraestructura del plan anterior ya completada).

Casos (~5):

- `POST /v1/users` con payload válido → `201` + body con `id` y `email` (sin campo `password`).
- `POST /v1/users` con el mismo email → `409 ConflictException`.
- `POST /v1/auth/login` con credenciales correctas → `200` + `{ access_token }`.
- `POST /v1/auth/login` con password incorrecto → `401`.
- `GET /v1/users/me` con token válido → `200` + perfil del usuario.

### 4. `test/notifications.e2e-spec.ts`

**Por qué existe:** cubre los 3 canales, el guard JWT, y el ownership enforcement (PATCH/DELETE de otro usuario). Todo con HTTP real + DB, sin dobles.

Precondición: `beforeAll` registra 2 usuarios y hace login para obtener 2 tokens.

Casos (~8):

- `POST /notifications` (email) con token válido → `201`.
- `POST /notifications` (sms) con token válido → `201`.
- `POST /notifications` (push) con token válido → `201`.
- `POST /notifications` sin token → `401`.
- `GET /notifications` → retorna solo las notificaciones del usuario autenticado (aislamiento).
- `PATCH /notifications/:id` con notificación del propio usuario → `200`.
- `PATCH /notifications/:id` con id de notificación de otro usuario → `404`.
- `DELETE /notifications/:id` propio → `204`.

---

## Dependencias entre pasos

Los tests e2e dependen de toda la infraestructura de setup. El orden de implementación es:

1. `docker-compose.test.yml` + `.env.test`
2. `test/setup.ts` + `test/truncate.ts`
3. Actualizar `test/jest-e2e.json` + scripts `package.json`
4. Tests unitarios (independientes, pueden escribirse en cualquier orden)
5. Tests e2e (requieren pasos 1–3 completos)

---

## Resumen

**Setup (infraestructura — sin casos de test):**

| Archivo                   | Acción          |
|---------------------------|-----------------|
| `docker-compose.test.yml` | Crear           |
| `.env.test`               | Crear           |
| `test/setup.ts`           | Crear           |
| `test/truncate.ts`        | Crear           |
| `test/jest-e2e.json`      | Actualizar      |
| `package.json`            | Agregar scripts |

**Tests:**

| Archivo                               | Tipo     | Casos   |
|---------------------------------------|----------|---------|
| `email-notification.strategy.spec.ts` | Unit     | 4       |
| `create-notification.dto.spec.ts`     | Unit     | 5       |
| `auth-users.e2e-spec.ts`              | E2E + DB | 5       |
| `notifications.e2e-spec.ts`           | E2E + DB | 8       |
| **Total**                             |          | **~22** |

Versus el plan anterior: 10 archivos, ~32 casos, donde la mitad testean delegación.
