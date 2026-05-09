import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una notificación',
    description:
      'Crea una notificación y dispara su envío por el canal indicado. ' +
      'El payload de `notification` se valida según el valor de `channel` (email | sms | push).',
  })
  @ApiCreatedResponse({
    description: 'Notificación creada y encolada para envío.',
  })
  @ApiBadRequestResponse({
    description: 'Payload inválido (falla la validación del DTO).',
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar notificaciones',
    description: 'Devuelve todas las notificaciones del usuario autenticado.',
  })
  @ApiOkResponse({ description: 'Listado de notificaciones del usuario.' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por id' })
  @ApiParam({
    name: 'id',
    description: 'Identificador numérico de la notificación.',
    example: 1,
  })
  @ApiOkResponse({ description: 'Notificación encontrada.' })
  @ApiNotFoundResponse({
    description: 'No existe una notificación con ese id.',
  })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar parcialmente una notificación',
    description:
      'Actualiza los campos enviados de una notificación existente. Acepta los mismos campos que `CreateNotificationDto` pero todos opcionales.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador numérico de la notificación.',
    example: 1,
  })
  @ApiOkResponse({ description: 'Notificación actualizada.' })
  @ApiBadRequestResponse({ description: 'Payload inválido.' })
  @ApiNotFoundResponse({
    description: 'No existe una notificación con ese id.',
  })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación' })
  @ApiParam({
    name: 'id',
    description: 'Identificador numérico de la notificación.',
    example: 1,
  })
  @ApiOkResponse({ description: 'Notificación eliminada.' })
  @ApiNotFoundResponse({
    description: 'No existe una notificación con ese id.',
  })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
