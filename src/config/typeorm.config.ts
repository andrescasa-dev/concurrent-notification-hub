import type { Config } from './config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function createTypeOrmOptions(env: Config): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_HOST_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    namingStrategy: new SnakeNamingStrategy(),
    autoLoadEntities: true,
    synchronize: false,
  };
}
