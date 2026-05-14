import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { cleanEnv } from 'envalid';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { environmentSpecs } from '../../src/config/config';
import { Notification } from '../../src/notifications/entities/notification.entity';
import { User } from '../../src/users/entities/user.entity';

/**
 * Jest globalSetup: runs once before the e2e suite. Applies migrations to the test DB.
 */
export default async function globalSetup(): Promise<void> {
  dotenv.config({ path: join(__dirname, '..', '..', '.env.test') });
  const env = cleanEnv(process.env, environmentSpecs);

  const dataSource = new DataSource({
    type: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_HOST_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    entities: [User, Notification],
    migrations: [join(process.cwd(), 'src', 'migrations', '*.{ts,js}')],
  });

  await dataSource.initialize();
  await dataSource.runMigrations();
  await dataSource.destroy();
}
