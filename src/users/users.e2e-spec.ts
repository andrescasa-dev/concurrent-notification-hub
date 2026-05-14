import type { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createE2EApp, createHttpAgent } from '../../test/e2e-bootstrap';
import { truncateAll } from '../../test/truncate';

type UserResponseBody = {
  id: number;
  email: string;
  password?: string;
};

type LoginResponseBody = {
  access_token: string;
};

describe('Users (e2e)', () => {
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

  it('POST /v1/users returns 201 with id and email without password', async () => {
    const res = await createHttpAgent(app)
      .post('/v1/users')
      .send({ email: 'newuser@test.com', password: 'secretpass' })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number) as number,
      email: 'newuser@test.com',
    });
    const body = res.body as UserResponseBody;
    expect(body.password).toBeUndefined();
  });

  it('POST /v1/users with duplicate email returns 409', async () => {
    const payload = { email: 'dup@test.com', password: 'secretpass' };
    await createHttpAgent(app).post('/v1/users').send(payload).expect(201);

    await createHttpAgent(app).post('/v1/users').send(payload).expect(409);
  });

  it('GET /v1/users/me returns profile when Bearer token is valid', async () => {
    await createHttpAgent(app)
      .post('/v1/users')
      .send({ email: 'me@test.com', password: 'secretpass' })
      .expect(201);

    const loginRes = await createHttpAgent(app)
      .post('/v1/auth/login')
      .send({ email: 'me@test.com', password: 'secretpass' })
      .expect(200);

    const token = (loginRes.body as LoginResponseBody).access_token;

    const res = await createHttpAgent(app)
      .get('/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toMatchObject({
      id: expect.any(Number) as number,
      email: 'me@test.com',
    });
    const meBody = res.body as UserResponseBody;
    expect(meBody.password).toBeUndefined();
  });
});
