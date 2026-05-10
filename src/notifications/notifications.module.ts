import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsChannelsEnum } from './constants/notifications-chanels';
import { NOTIFICATIONS_REPOSITORY } from './constants/injection-tokens';
import {
  NOTIFICATION_STRATEGIES,
  type NotificationStrategiesByChannel,
} from './constants/strategy.tokens';
import { SimulatedGmailEmailClient } from './clients/email/simulated-gmail.email-client';
import { SimulatedPushClient } from './clients/push/simulated-push.client';
import { SimulatedSmsClient } from './clients/sms/simulated-sms.client';
import { NotificationsController } from './controllers/notifications.controller';
import { Notification } from './entities/notification.entity';
import { NotificationsTypeOrmRepository } from './repositories/notifications.repository';
import { NotificationsService } from './services/notifications.service';
import { EmailNotificationStrategy } from './strategies/email-notification.strategy';
import { PushNotificationStrategy } from './strategies/push-notification.strategy';
import { SmsNotificationStrategy } from './strategies/sms-notification.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [
    { provide: 'IEmailClient', useClass: SimulatedGmailEmailClient },
    { provide: 'ISmsClient', useClass: SimulatedSmsClient },
    { provide: 'IPushClient', useClass: SimulatedPushClient },
    EmailNotificationStrategy,
    SmsNotificationStrategy,
    PushNotificationStrategy,
    {
      provide: NOTIFICATION_STRATEGIES,
      useFactory: (
        email: EmailNotificationStrategy,
        sms: SmsNotificationStrategy,
        push: PushNotificationStrategy,
      ): NotificationStrategiesByChannel => ({
        [NotificationsChannelsEnum.EMAIL]: email,
        [NotificationsChannelsEnum.SMS]: sms,
        [NotificationsChannelsEnum.PUSH]: push,
      }),
      inject: [
        EmailNotificationStrategy,
        SmsNotificationStrategy,
        PushNotificationStrategy,
      ],
    },
    {
      provide: NOTIFICATIONS_REPOSITORY,
      useClass: NotificationsTypeOrmRepository,
    },
    NotificationsService,
  ],
})
export class NotificationsModule {}
