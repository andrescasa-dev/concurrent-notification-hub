import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NOTIFICATIONS_REPOSITORY } from '../constants/injection-tokens';
import {
  NOTIFICATION_STRATEGIES,
  type NotificationStrategiesByChannel,
} from '../constants/strategy.tokens';
import { NotificationDeliveryStatus } from '../constants/notification-delivery-status';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';
import type { Notification } from '../entities/notification.entity';
import type { NotificationsRepository } from '../repositories/notifications.repository.interface';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATION_STRATEGIES)
    private readonly strategiesByChannel: NotificationStrategiesByChannel,
    @Inject(NOTIFICATIONS_REPOSITORY)
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
    userId: number,
  ): Promise<Notification> {
    const strategy = this.strategiesByChannel[createNotificationDto.channel];
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported notification channel: ${String(createNotificationDto.channel)}`,
      );
    }
    const sendResult = await strategy.send(createNotificationDto);
    // Take-home only: log simulated send result to the console. In production you would use
    // structured logging, traces, queues, etc., instead of console.log here.
    console.log(sendResult);

    const { title, content, recipient } = createNotificationDto.notification;
    return this.notificationsRepository.create({
      userId,
      title,
      content,
      channel: createNotificationDto.channel,
      recipient,
      status: NotificationDeliveryStatus.SENT,
    });
  }

  findAll(userId: number): Promise<Notification[]> {
    return this.notificationsRepository.findAllByUserId(userId);
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async update(
    id: number,
    userId: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const updated = await this.notificationsRepository.updateByIdAndUserId(
      id,
      userId,
      updateNotificationDto,
    );
    if (!updated) {
      throw new NotFoundException();
    }
    return updated;
  }

  async remove(id: number, userId: number): Promise<void> {
    const deleted = await this.notificationsRepository.deleteByIdAndUserId(
      id,
      userId,
    );
    if (!deleted) {
      throw new NotFoundException();
    }
  }
}
