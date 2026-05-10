import { NotificationsChannelsEnum } from './notifications-chanels';
import { NotificationSendingStrategy } from '../strategies/notification-sending-strategy.interface';

export const NOTIFICATION_STRATEGIES = Symbol('NOTIFICATION_STRATEGIES');

export type NotificationStrategiesByChannel = Record<
  NotificationsChannelsEnum,
  NotificationSendingStrategy
>;
