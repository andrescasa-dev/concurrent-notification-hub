import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '../../auth/models/authenticated-user';
import { CreateNotificationDto } from '../dtos/create-notification.dto';
import { UpdateNotificationDto } from '../dtos/update-notification.dto';
import { Notification } from '../entities/notification.entity';
import { NotificationsService } from '../services/notifications.service';

@ApiTags('Notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a notification',
    description:
      'Creates a notification and triggers delivery on the selected channel. ' +
      'The `notification` payload is validated according to `channel` (email | sms | push).',
  })
  @ApiCreatedResponse({
    description: 'Notification created and persisted.',
    type: Notification,
  })
  @ApiBadRequestResponse({
    description: 'Invalid payload (DTO validation failed).',
  })
  create(
    @Request() req: { user: AuthenticatedUser },
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationsService.create(createNotificationDto, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List notifications',
    description: 'Returns all notifications for the authenticated user.',
  })
  @ApiOkResponse({
    description: 'List of notifications for the user.',
    type: Notification,
    isArray: true,
  })
  findAll(@Request() req: { user: AuthenticatedUser }) {
    return this.notificationsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by id' })
  @ApiParam({
    name: 'id',
    description: 'Numeric notification id.',
    example: 1,
  })
  @ApiOkResponse({ description: 'Notification found.' })
  @ApiNotFoundResponse({
    description: 'No notification exists with that id.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Partially update a notification',
    description:
      'Updates stored fields (`title`, `content`, `recipient`) on the authenticated user’s notification. Does not change the channel or trigger a new delivery.',
  })
  @ApiParam({
    name: 'id',
    description: 'Numeric notification id.',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Notification updated.',
    type: Notification,
  })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  @ApiNotFoundResponse({
    description: 'No notification exists with that id for this user.',
  })
  update(
    @Request() req: { user: AuthenticatedUser },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(
      id,
      req.user.id,
      updateNotificationDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiParam({
    name: 'id',
    description: 'Numeric notification id.',
    example: 1,
  })
  @ApiNoContentResponse({ description: 'Notification deleted.' })
  @ApiNotFoundResponse({
    description: 'No notification exists with that id.',
  })
  remove(
    @Request() req: { user: AuthenticatedUser },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.remove(id, req.user.id);
  }
}
