import type { Notification } from '../entities/notification.entity';

export interface NotificationsRepository {
  create(params: {
    userId: number;
    title: string;
    content: string;
    channel: string;
  }): Promise<Notification>;

  findAllByUserId(userId: number): Promise<Notification[]>;

  deleteByIdAndUserId(id: number, userId: number): Promise<boolean>;
}
