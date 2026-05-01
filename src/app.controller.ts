import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

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
}
