import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { DemoRecord } from './entities/demo-record.entity';

@ApiTags('app')
@Controller({ version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello world' })
  @ApiOkResponse({
    description: 'Plain text greeting',
    schema: { type: 'string', example: 'hello world' },
  })
  getRoot(): string {
    return this.appService.getRoot();
  }

  @Post('demo-records')
  @ApiOperation({ summary: 'Create a row in demo_records' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'smoke test' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Row created', type: DemoRecord })
  async createDemoRecord(
    @Body() body: { message?: string },
  ): Promise<DemoRecord> {
    const message = body?.message?.trim() || 'hello from api';
    return await this.appService.createDemoRecord(message);
  }
}
