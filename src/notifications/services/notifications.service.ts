import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';

@Injectable()
export class NotificationsService {
  create(createNotificationDto: CreateNotificationDto) {
    // Plan
    // 1. valid the payload with DTO (controller)
    // 2. Select the sending strategy
    // 3. store the notification
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
