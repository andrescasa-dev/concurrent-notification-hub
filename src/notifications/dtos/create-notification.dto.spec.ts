import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NotificationsChannelsEnum } from '../constants/notifications-chanels';
import { CreateNotificationDto } from './create-notification.dto';

const pushToken = 'a'.repeat(32);

describe('CreateNotificationDto', () => {
  it('validates a correct email channel payload', async () => {
    const plain = {
      channel: NotificationsChannelsEnum.EMAIL,
      notification: {
        title: 'Hi',
        content: 'Body',
        recipient: 'user@example.com',
      },
    };
    const dto = plainToInstance(CreateNotificationDto, plain);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('validates a correct sms channel payload', async () => {
    const plain = {
      channel: NotificationsChannelsEnum.SMS,
      notification: {
        title: 'SMS title',
        content: 'Short',
        recipient: '+573116622964',
      },
    };
    const dto = plainToInstance(CreateNotificationDto, plain);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('validates a correct push channel payload', async () => {
    const plain = {
      channel: NotificationsChannelsEnum.PUSH,
      notification: {
        title: 'Push',
        content: 'Msg',
        recipient: pushToken,
      },
    };
    const dto = plainToInstance(CreateNotificationDto, plain);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when channel is email but recipient is a phone number', async () => {
    const plain = {
      channel: NotificationsChannelsEnum.EMAIL,
      notification: {
        title: 'Hi',
        content: 'Body',
        recipient: '+573116622964',
      },
    };
    const dto = plainToInstance(CreateNotificationDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when channel is sms and content exceeds 160 characters', async () => {
    const plain = {
      channel: NotificationsChannelsEnum.SMS,
      notification: {
        title: 'T',
        content: 'x'.repeat(161),
        recipient: '+573116622964',
      },
    };
    const dto = plainToInstance(CreateNotificationDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('fails when channel is push and recipient is shorter than 32 characters', async () => {
    const plain = {
      channel: NotificationsChannelsEnum.PUSH,
      notification: {
        title: 'Push',
        content: 'Msg',
        recipient: 'a'.repeat(31),
      },
    };
    const dto = plainToInstance(CreateNotificationDto, plain);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
