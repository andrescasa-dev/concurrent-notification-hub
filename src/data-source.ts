import 'reflect-metadata';
import 'dotenv/config';
import { cleanEnv } from 'envalid';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'node:path';
import { environmentSpecs } from './config/config';
import { User } from './users/entities/user.entity';

const env = cleanEnv(process.env, environmentSpecs);

/**
 * Standalone DataSource for TypeORM CLI (ts-node); uses the same env specs as Nest.
 */
export default new DataSource({
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_HOST_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  entities: [User],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
