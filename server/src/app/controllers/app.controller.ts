import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getStatus(): Promise<{
    status: number;
    health: string;
    message: string;
  }> {
    return this.appService.getHealth();
  }
}
