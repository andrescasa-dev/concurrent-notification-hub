import type { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createE2EApp, createHttpAgent } from '../../test/e2e-bootstrap';
import { truncateAll } from '../../test/truncate';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    app = await createE2EApp();
    dataSource = app.get(DataSource);
    await truncateAll(dataSource);
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /v1/auth/login returns access_token with valid credentials', async () => {
    await createHttpAgent(app)
      .post('/v1/users')
      .send({ email: 'loginok@test.com', password: 'secretpass' })
      .expect(201);

    const res = await createHttpAgent(app)
      .post('/v1/auth/login')
      .send({ email: 'loginok@test.com', password: 'secretpass' })
      .expect(200);

    expect(res.body).toEqual({
      access_token: expect.any(String) as string,
    });
  });

  it('POST /v1/auth/login returns 401 with wrong password', async () => {
    await createHttpAgent(app)
      .post('/v1/users')
      .send({ email: 'badlogin@test.com', password: 'secretpass' })
      .expect(201);

    await createHttpAgent(app)
      .post('/v1/auth/login')
      .send({ email: 'badlogin@test.com', password: 'wrongpass' })
      .expect(401);
  });
});
