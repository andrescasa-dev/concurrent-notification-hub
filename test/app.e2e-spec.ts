import type { INestApplication } from '@nestjs/common';
import { createE2EApp, createHttpAgent } from './utils/e2e-bootstrap';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createE2EApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /v1', () => {
    return createHttpAgent(app).get('/v1').expect(200).expect('hello world');
  });
});
