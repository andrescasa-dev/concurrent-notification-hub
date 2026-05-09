import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { NotificationsChannelsEnum } from '../enums/notifications-chanels';
import { CreateEmailDto } from './create-email.dto';
import { CreatePushDto } from './create-push.dto';
import { CreateSmsDto } from './create-sms.dto';

@ApiExtraModels(CreateEmailDto, CreateSmsDto, CreatePushDto)
export class CreateNotificationDto {
  @ApiProperty({
    description:
      'Canal por el que se enviará la notificación. Determina la forma esperada del campo `notification`.',
    enum: NotificationsChannelsEnum,
    enumName: 'NotificationsChannelsEnum',
    example: NotificationsChannelsEnum.SMS,
  })
  @IsNotEmpty()
  @IsEnum(NotificationsChannelsEnum)
  channel!: NotificationsChannelsEnum;

  @ApiProperty({
    description:
      'Payload de la notificación. Su estructura depende del valor de `channel`: ' +
      '`email` → `CreateEmailDto`, `sms` → `CreateSmsDto`, `push` → `CreatePushDto`.',
    oneOf: [
      { $ref: getSchemaPath(CreateEmailDto) },
      { $ref: getSchemaPath(CreateSmsDto) },
      { $ref: getSchemaPath(CreatePushDto) },
    ],
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type((opts) => {
    const channel = opts?.object?.channel as NotificationsChannelsEnum;
    const dtoMap = {
      [NotificationsChannelsEnum.EMAIL]: CreateEmailDto,
      [NotificationsChannelsEnum.SMS]: CreateSmsDto,
      [NotificationsChannelsEnum.PUSH]: CreatePushDto,
    };
    return dtoMap[channel];
  })
  notification!: CreateEmailDto | CreateSmsDto | CreatePushDto;
}
