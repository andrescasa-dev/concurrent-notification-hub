import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { NotificationDeliveryStatus } from '../constants/notification-delivery-status';
import { Notification } from '../entities/notification.entity';
import type { NotificationsRepository as INotificationsRepository } from './notifications.repository.interface';

@Injectable()
export class NotificationsTypeOrmRepository implements INotificationsRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  async create(params: {
    userId: number;
    title: string;
    content: string;
    channel: string;
    recipient: string;
    status: NotificationDeliveryStatus;
  }): Promise<Notification> {
    const entity = this.repository.create({
      title: params.title,
      content: params.content,
      channel: params.channel,
      recipient: params.recipient,
      status: params.status,
      user: { id: params.userId },
    });
    return this.repository.save(entity);
  }

  findAllByUserId(userId: number): Promise<Notification[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateByIdAndUserId(
    id: number,
    userId: number,
    patch: {
      title?: string;
      content?: string;
      recipient?: string;
    },
  ): Promise<Notification | null> {
    const columns = Object.fromEntries(
      Object.entries(patch).filter(([, value]) => value !== undefined),
    ) as Partial<Pick<Notification, 'title' | 'content' | 'recipient'>>;
    if (Object.keys(columns).length === 0) {
      return this.repository.findOne({
        where: { id, user: { id: userId } },
      });
    }
    const result = await this.repository
      .createQueryBuilder()
      .update(Notification)
      .set(columns)
      .where('id = :id', { id })
      .andWhere('user_id = :userId', { userId })
      .execute();
    if ((result.affected ?? 0) === 0) {
      return null;
    }
    return this.repository.findOne({
      where: { id, user: { id: userId } },
    });
  }

  async deleteByIdAndUserId(id: number, userId: number): Promise<boolean> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where('id = :id', { id })
      .andWhere('user_id = :userId', { userId })
      .execute();
    return (result.affected ?? 0) > 0;
  }
}
