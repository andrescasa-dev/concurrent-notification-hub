import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PUSH_CLIENT } from '../constants/client.tokens';
import { NotificationsChannelsEnum } from '../constants/notifications-chanels';
import type { IPushClient } from '../clients/push/i-push.client';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationSendingStrategy } from './notification-sending-strategy.interface';
import { SimulatedSendResult } from './simulated-send-result';

@Injectable()
export class PushNotificationStrategy implements NotificationSendingStrategy {
  constructor(
    @Inject(PUSH_CLIENT)
    private readonly pushClient: IPushClient,
  ) {}

  async send(dto: CreateNotificationDto): Promise<SimulatedSendResult> {
    if (dto.channel !== NotificationsChannelsEnum.PUSH) {
      throw new BadRequestException('Expected push channel');
    }
    const notification = dto.notification;
    const { simulatedMessageId } = await this.pushClient.send({
      deviceToken: notification.recipient,
      title: notification.title,
      body: notification.content,
    });
    return {
      channel: NotificationsChannelsEnum.PUSH,
      simulatedMessageId,
      status: 'simulated',
    };
  }
}
