import { BadRequestException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { PUSH_CLIENT } from '../constants/client.tokens';
import { NotificationsChannelsEnum } from '../constants/notifications-chanels';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import type { IPushClient } from '../clients/push/i-push.client';
import { PushNotificationStrategy } from './push-notification.strategy';

const deviceToken = 'a'.repeat(32);

describe('PushNotificationStrategy', () => {
  let strategy: PushNotificationStrategy;
  let pushClient: { send: jest.Mock };

  beforeEach(async () => {
    pushClient = {
      send: jest.fn().mockResolvedValue({ simulatedMessageId: 'push-1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushNotificationStrategy,
        { provide: PUSH_CLIENT, useValue: pushClient as IPushClient },
      ],
    }).compile();

    strategy = module.get(PushNotificationStrategy);
  });

  it('send() calls pushClient.send exactly once with deviceToken, title, and body', async () => {
    const dto = {
      channel: NotificationsChannelsEnum.PUSH,
      notification: {
        title: 'Hello',
        content: 'World',
        recipient: deviceToken,
      },
    } as CreateNotificationDto;

    await strategy.send(dto);

    expect(pushClient.send).toHaveBeenCalledTimes(1);
    expect(pushClient.send).toHaveBeenCalledWith({
      deviceToken,
      title: 'Hello',
      body: 'World',
    });
  });

  it('send() throws BadRequestException when channel is not push', async () => {
    const dto = {
      channel: NotificationsChannelsEnum.SMS,
      notification: {
        title: 'T',
        content: 'C',
        recipient: '+573116622964',
      },
    } as CreateNotificationDto;

    await expect(strategy.send(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(pushClient.send).not.toHaveBeenCalled();
  });
});
