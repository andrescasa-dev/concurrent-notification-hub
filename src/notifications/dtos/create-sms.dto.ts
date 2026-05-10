import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { CreateBaseNotificationDto } from './create-base-notification.dto';

export class CreateSmsDto extends CreateBaseNotificationDto {
  @ApiProperty({
    description:
      'Número de teléfono del destinatario en formato E.164 (con prefijo internacional, p. ej. `+57...`).',
    example: '+573116622964',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  recipient!: string;
}
