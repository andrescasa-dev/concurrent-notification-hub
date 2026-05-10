import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SMS_CLIENT } from '../constants/client.tokens';
import { NotificationsChannelsEnum } from '../constants/notifications-chanels';
import type { ISmsClient } from '../clients/sms/i-sms.client';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationSendingStrategy } from './notification-sending-strategy.interface';
import { SimulatedSendResult } from './simulated-send-result';

@Injectable()
export class SmsNotificationStrategy implements NotificationSendingStrategy {
  constructor(
    @Inject(SMS_CLIENT)
    private readonly smsClient: ISmsClient,
  ) {}

  async send(dto: CreateNotificationDto): Promise<SimulatedSendResult> {
    if (dto.channel !== NotificationsChannelsEnum.SMS) {
      throw new BadRequestException('Expected sms channel');
    }
    const notification = dto.notification;
    const { simulatedMessageId } = await this.smsClient.send({
      to: notification.recipient,
      body: notification.content,
    });
    return {
      channel: NotificationsChannelsEnum.SMS,
      simulatedMessageId,
      status: 'simulated',
    };
  }
}
