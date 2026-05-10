import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  }): Promise<Notification> {
    const entity = this.repository.create({
      title: params.title,
      content: params.content,
      channel: params.channel,
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
