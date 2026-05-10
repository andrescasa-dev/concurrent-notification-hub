import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateBaseNotificationDto } from './create-base-notification.dto';

export class CreateSmsDto extends CreateBaseNotificationDto {
  @ApiProperty({
    description:
      'Contenido del SMS (máximo 160 caracteres, longitud típica de un segmento GSM-7).',
    example: 'some content',
    maxLength: 160,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(160)
  override content = '';

  @ApiProperty({
    description:
      'Número de teléfono del destinatario en formato E.164 (con prefijo internacional, p. ej. `+57...`).',
    example: '+573116622964',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  recipient!: string;
}
