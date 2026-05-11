import type { NotificationDeliveryStatus } from '../constants/notification-delivery-status';
import type { Notification } from '../entities/notification.entity';

export interface NotificationsRepository {
  create(params: {
    userId: number;
    title: string;
    content: string;
    channel: string;
    recipient: string;
    status: NotificationDeliveryStatus;
  }): Promise<Notification>;

  findAllByUserId(userId: number): Promise<Notification[]>;

  updateByIdAndUserId(
    id: number,
    userId: number,
    patch: {
      title?: string;
      content?: string;
      recipient?: string;
    },
  ): Promise<Notification | null>;

  deleteByIdAndUserId(id: number, userId: number): Promise<boolean>;
}
