import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateBaseNotificationDto } from './create-base-notification.dto';

export class CreateEmailDto extends CreateBaseNotificationDto {
  @ApiProperty({
    description: 'Email del destinatario en formato RFC 5322.',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  recipient!: string;
}
