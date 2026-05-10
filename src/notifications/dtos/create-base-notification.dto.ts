import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export abstract class CreateBaseNotificationDto {
  @ApiProperty({
    description: 'Título de la notificación.',
    example: 'first notification',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    description: 'Contenido / cuerpo de la notificación.',
    example: 'some content',
  })
  @IsNotEmpty()
  @IsString()
  content!: string;
}
