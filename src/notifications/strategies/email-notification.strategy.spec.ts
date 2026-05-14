import { BadRequestException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { EMAIL_CLIENT } from '../constants/client.tokens';
import { NotificationsChannelsEnum } from '../constants/notifications-chanels';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import type {
  EmailSendParams,
  IEmailClient,
} from '../clients/email/i-email.client';
import { EmailNotificationStrategy } from './email-notification.strategy';

describe('EmailNotificationStrategy', () => {
  let strategy: EmailNotificationStrategy;
  let emailClient: { send: jest.Mock };

  beforeEach(async () => {
    emailClient = {
      send: jest.fn().mockResolvedValue({ simulatedMessageId: 'msg-1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailNotificationStrategy,
        { provide: EMAIL_CLIENT, useValue: emailClient as IEmailClient },
      ],
    }).compile();

    strategy = module.get(EmailNotificationStrategy);
  });

  it('send() calls emailClient.send with to, subject, and htmlBody', async () => {
    const dto = {
      channel: NotificationsChannelsEnum.EMAIL,
      notification: {
        title: 'Hello',
        content: 'World',
        recipient: 'user@example.com',
      },
    } as CreateNotificationDto;

    await strategy.send(dto);

    expect(emailClient.send).toHaveBeenCalledTimes(1);
    expect(emailClient.send).toHaveBeenCalledWith({
      to: 'user@example.com',
      subject: 'Hello',
      htmlBody: expect.any(String) as string,
    });
  });

  it('send() htmlBody wraps title in h1 and content in p', async () => {
    const dto = {
      channel: NotificationsChannelsEnum.EMAIL,
      notification: {
        title: 'T',
        content: 'C',
        recipient: 'a@b.co',
      },
    } as CreateNotificationDto;

    await strategy.send(dto);

    expect(emailClient.send).toHaveBeenCalledTimes(1);
    const calls = emailClient.send.mock.calls as Array<[EmailSendParams]>;
    const firstCall = calls[0];
    expect(firstCall).toBeDefined();
    const { htmlBody } = firstCall[0];
    expect(htmlBody).toContain('<h1>T</h1>');
    expect(htmlBody).toContain('<p>C</p>');
  });

  it('send() escapes <, >, &, " in title and content in htmlBody', async () => {
    const dto = {
      channel: NotificationsChannelsEnum.EMAIL,
      notification: {
        title: '<tag>&"x',
        content: '>"&<',
        recipient: 'u@e.com',
      },
    } as CreateNotificationDto;

    await strategy.send(dto);

    expect(emailClient.send).toHaveBeenCalledTimes(1);
    const calls = emailClient.send.mock.calls as Array<[EmailSendParams]>;
    const firstCall = calls[0];
    expect(firstCall).toBeDefined();
    const { htmlBody } = firstCall[0];
    expect(htmlBody).toContain('&lt;tag&gt;&amp;&quot;x');
    expect(htmlBody).toContain('&gt;&quot;&amp;&lt;');
    expect(htmlBody).not.toContain('<tag>');
  });

  it('send() throws BadRequestException when channel is not email', async () => {
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
    expect(emailClient.send).not.toHaveBeenCalled();
  });
});
