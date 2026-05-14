import { BadRequestException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { SMS_CLIENT } from '../constants/client.tokens';
import { NotificationsChannelsEnum } from '../constants/notifications-chanels';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import type { ISmsClient } from '../clients/sms/i-sms.client';
import { SmsNotificationStrategy } from './sms-notification.strategy';

describe('SmsNotificationStrategy', () => {
  let strategy: SmsNotificationStrategy;
  let smsClient: { send: jest.Mock };

  beforeEach(async () => {
    smsClient = {
      send: jest.fn().mockResolvedValue({ simulatedMessageId: 'sms-1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsNotificationStrategy,
        { provide: SMS_CLIENT, useValue: smsClient as ISmsClient },
      ],
    }).compile();

    strategy = module.get(SmsNotificationStrategy);
  });

  it('send() calls smsClient.send exactly once with to and body', async () => {
    const dto = {
      channel: NotificationsChannelsEnum.SMS,
      notification: {
        title: 'T',
        content: 'Body text',
        recipient: '+573116622964',
      },
    } as CreateNotificationDto;

    await strategy.send(dto);

    expect(smsClient.send).toHaveBeenCalledTimes(1);
    expect(smsClient.send).toHaveBeenCalledWith({
      to: '+573116622964',
      body: 'Body text',
    });
  });

  it('send() throws BadRequestException when channel is not sms', async () => {
    const dto = {
      channel: NotificationsChannelsEnum.EMAIL,
      notification: {
        title: 'T',
        content: 'C',
        recipient: 'u@e.com',
      },
    } as CreateNotificationDto;

    await expect(strategy.send(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(smsClient.send).not.toHaveBeenCalled();
  });
});
