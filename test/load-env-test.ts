import * as dotenv from 'dotenv';
import { resolve } from 'node:path';

/**
 * Runs in each Jest worker before tests so Nest/Envalid see test DB credentials.
 * globalSetup runs in a separate process and does not populate worker env.
 */
dotenv.config({ path: resolve(__dirname, '..', '.env.test') });
