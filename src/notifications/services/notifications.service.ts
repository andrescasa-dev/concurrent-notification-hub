import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_STRATEGIES,
  type NotificationStrategiesByChannel,
} from '../constants/strategy.tokens';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';
import { SimulatedSendResult } from '../strategies/simulated-send-result';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATION_STRATEGIES)
    private readonly strategiesByChannel: NotificationStrategiesByChannel,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<SimulatedSendResult> {
    const strategy = this.strategiesByChannel[createNotificationDto.channel];
    if (!strategy) {
      throw new BadRequestException(
        `Unsupported notification channel: ${String(createNotificationDto.channel)}`,
      );
    }
    return strategy.send(createNotificationDto);
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    void updateNotificationDto;
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
