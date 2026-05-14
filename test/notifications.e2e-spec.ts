import type { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { NotificationsChannelsEnum } from '../src/notifications/constants/notifications-chanels';
import { createE2EApp, createHttpAgent } from './e2e-bootstrap';
import { truncateAll } from './truncate';

const pushRecipient = 'a'.repeat(32);

type LoginResponseBody = {
  access_token: string;
};

type NotificationResponseBody = {
  id: number;
  title: string;
  content: string;
  channel: string;
};

describe('Notifications (e2e)', () => {
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

  async function registerAndLogin(
    email: string,
    password: string,
  ): Promise<string> {
    await createHttpAgent(app)
      .post('/v1/users')
      .send({ email, password })
      .expect(201);
    const loginRes = await createHttpAgent(app)
      .post('/v1/auth/login')
      .send({ email, password })
      .expect(200);
    const loginBody = loginRes.body as LoginResponseBody;
    return loginBody.access_token;
  }

  it('POST /notifications (email) returns 201 with valid JWT', async () => {
    const token = await registerAndLogin('email-user@test.com', 'secretpass');

    const res = await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        channel: NotificationsChannelsEnum.EMAIL,
        notification: {
          title: 'T',
          content: 'C',
          recipient: 'dest@example.com',
        },
      })
      .expect(201);

    expect(res.body).toMatchObject({
      id: expect.any(Number) as number,
      channel: NotificationsChannelsEnum.EMAIL,
      recipient: 'dest@example.com',
      title: 'T',
      content: 'C',
    });
  });

  it('POST /notifications (sms) returns 201 with valid JWT', async () => {
    const token = await registerAndLogin('sms-user@test.com', 'secretpass');

    const res = await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        channel: NotificationsChannelsEnum.SMS,
        notification: {
          title: 'SMS',
          content: 'Hello',
          recipient: '+573116622964',
        },
      })
      .expect(201);

    const row = res.body as NotificationResponseBody;
    expect(row.channel).toBe(NotificationsChannelsEnum.SMS);
  });

  it('POST /notifications (push) returns 201 with valid JWT', async () => {
    const token = await registerAndLogin('push-user@test.com', 'secretpass');

    const res = await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        channel: NotificationsChannelsEnum.PUSH,
        notification: {
          title: 'Push',
          content: 'Body',
          recipient: pushRecipient,
        },
      })
      .expect(201);

    const row = res.body as NotificationResponseBody;
    expect(row.channel).toBe(NotificationsChannelsEnum.PUSH);
  });

  it('POST /notifications without token returns 401', async () => {
    await createHttpAgent(app)
      .post('/v1/notifications')
      .send({
        channel: NotificationsChannelsEnum.EMAIL,
        notification: {
          title: 'T',
          content: 'C',
          recipient: 'x@y.com',
        },
      })
      .expect(401);
  });

  it('GET /notifications returns only notifications for the authenticated user', async () => {
    const tokenA = await registerAndLogin('user-a@test.com', 'secretpass');
    const tokenB = await registerAndLogin('user-b@test.com', 'secretpass');

    await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        channel: NotificationsChannelsEnum.EMAIL,
        notification: {
          title: 'A1',
          content: 'c1',
          recipient: 'a1@example.com',
        },
      })
      .expect(201);
    await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        channel: NotificationsChannelsEnum.EMAIL,
        notification: {
          title: 'A2',
          content: 'c2',
          recipient: 'a2@example.com',
        },
      })
      .expect(201);

    await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        channel: NotificationsChannelsEnum.EMAIL,
        notification: {
          title: 'B1',
          content: 'c',
          recipient: 'b1@example.com',
        },
      })
      .expect(201);

    const listA = await createHttpAgent(app)
      .get('/v1/notifications')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(Array.isArray(listA.body)).toBe(true);
    const listABody = listA.body as NotificationResponseBody[];
    expect(listABody).toHaveLength(2);
    expect(listABody.map((n) => n.title).sort()).toEqual(['A1', 'A2']);

    const listB = await createHttpAgent(app)
      .get('/v1/notifications')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    const listBBody = listB.body as NotificationResponseBody[];
    expect(listBBody).toHaveLength(1);
    expect(listBBody[0]?.title).toBe('B1');
  });

  it('PATCH /notifications/:id updates own notification and returns 200', async () => {
    const token = await registerAndLogin('patch-own@test.com', 'secretpass');

    const created = await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        channel: NotificationsChannelsEnum.EMAIL,
        notification: {
          title: 'Old',
          content: 'Old body',
          recipient: 'old@example.com',
        },
      })
      .expect(201);

    const createdBody = created.body as NotificationResponseBody;
    const id = createdBody.id;

    const res = await createHttpAgent(app)
      .patch(`/v1/notifications/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New title' })
      .expect(200);

    const updated = res.body as NotificationResponseBody;
    expect(updated.title).toBe('New title');
    expect(updated.content).toBe('Old body');
  });

  it('PATCH /notifications/:id returns 404 when notification belongs to another user', async () => {
    const tokenA = await registerAndLogin('owner@test.com', 'secretpass');
    const tokenB = await registerAndLogin('other@test.com', 'secretpass');

    const created = await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        channel: NotificationsChannelsEnum.EMAIL,
        notification: {
          title: 'Owned',
          content: 'c',
          recipient: 'o@example.com',
        },
      })
      .expect(201);

    const createdBody = created.body as NotificationResponseBody;
    const id = createdBody.id;

    await createHttpAgent(app)
      .patch(`/v1/notifications/${id}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Hacked' })
      .expect(404);
  });

  it('DELETE /notifications/:id returns 204 for own notification', async () => {
    const token = await registerAndLogin('delete-own@test.com', 'secretpass');

    const created = await createHttpAgent(app)
      .post('/v1/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        channel: NotificationsChannelsEnum.EMAIL,
        notification: {
          title: 'Del',
          content: 'c',
          recipient: 'd@example.com',
        },
      })
      .expect(201);

    const createdBody = created.body as NotificationResponseBody;
    const id = createdBody.id;

    await createHttpAgent(app)
      .delete(`/v1/notifications/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const list = await createHttpAgent(app)
      .get('/v1/notifications')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const listBody = list.body as NotificationResponseBody[];
    expect(listBody).toHaveLength(0);
  });
});
