import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CreateBaseNotificationDto } from './create-base-notification.dto';

export class CreatePushDto extends CreateBaseNotificationDto {
  @ApiProperty({
    description:
      'Token del dispositivo (FCM/APNs) al que se enviará la push. Debe tener al menos 32 caracteres.',
    example: 'fcm_device_token_abcdef0123456789abcdef',
    minLength: 32,
  })
  @IsString()
  @MinLength(32)
  @IsNotEmpty()
  recipient!: string;
}
