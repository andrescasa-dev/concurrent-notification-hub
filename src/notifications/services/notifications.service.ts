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

    const { title, content } = createNotificationDto.notification;
    return this.notificationsRepository.create({
      userId,
      title,
      content,
      channel: createNotificationDto.channel,
    });
  }

  findAll(userId: number): Promise<Notification[]> {
    return this.notificationsRepository.findAllByUserId(userId);
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO: usar al implementar actualización
    updateNotificationDto: UpdateNotificationDto,
  ): string {
    // TODO: implementar actualización
    return `This action updates a #${id} notification`;
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
