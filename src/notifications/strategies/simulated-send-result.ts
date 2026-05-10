import { NotificationsChannelsEnum } from '../constants/notifications-chanels';

export interface SimulatedSendResult {
  channel: NotificationsChannelsEnum;
  simulatedMessageId: string;
  status: 'simulated';
}
