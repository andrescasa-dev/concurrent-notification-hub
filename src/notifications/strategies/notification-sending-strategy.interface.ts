import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { SimulatedSendResult } from './simulated-send-result';

export interface NotificationSendingStrategy {
  send(dto: CreateNotificationDto): Promise<SimulatedSendResult>;
}
