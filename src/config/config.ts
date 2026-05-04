import {
  ENVALID,
  makeValidators,
  num,
  port,
  str,
  type Static,
} from 'nestjs-envalid';

/**
 * Share this object with `cleanEnv` outside Nest (e.g. TypeORM CLI data-source).
 */
export const environmentSpecs = {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  PORT: num({ default: 3000 }),
  POSTGRES_HOST: str(),
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str(),
  POSTGRES_HOST_PORT: port({ default: 5432 }),
};

export const validators = makeValidators(environmentSpecs);

export type Config = Static<typeof validators>;

export { ENVALID };
