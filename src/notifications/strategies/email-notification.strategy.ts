import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EMAIL_CLIENT } from '../constants/client.tokens';
import { NotificationsChannelsEnum } from '../constants/notifications-chanels';
import type { IEmailClient } from '../clients/email/i-email.client';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { NotificationSendingStrategy } from './notification-sending-strategy.interface';
import { SimulatedSendResult } from './simulated-send-result';

@Injectable()
export class EmailNotificationStrategy implements NotificationSendingStrategy {
  constructor(
    @Inject(EMAIL_CLIENT)
    private readonly emailClient: IEmailClient,
  ) {}

  async send(dto: CreateNotificationDto): Promise<SimulatedSendResult> {
    if (dto.channel !== NotificationsChannelsEnum.EMAIL) {
      throw new BadRequestException('Expected email channel');
    }
    const notification = dto.notification;
    const htmlBody = this.buildTemplate(
      notification.title,
      notification.content,
    );
    const { simulatedMessageId } = await this.emailClient.send({
      to: notification.recipient,
      subject: notification.title,
      htmlBody,
    });
    return {
      channel: NotificationsChannelsEnum.EMAIL,
      simulatedMessageId,
      status: 'simulated',
    };
  }

  private buildTemplate(title: string, content: string): string {
    return [
      '<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body>',
      `<header><h1>${escapeHtml(title)}</h1></header>`,
      `<main><p>${escapeHtml(content)}</p></main>`,
      '</body></html>',
    ].join('');
  }
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
