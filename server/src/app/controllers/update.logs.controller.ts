import { Response } from 'express';
import {
  Controller,
  HttpStatus,
  Res,
  Post,
  Body,
  UseInterceptors,
  Get,
  UseGuards,
} from '@nestjs/common';
import { Logger } from '../services/logger.service';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { UpdateLogsService } from '../services/update-logs.service';
import { AuthenticationGuard } from '../guards/authentication.guards';

@Controller('/api/v1/')
@UseGuards(AuthenticationGuard)
@UseInterceptors(LoggingInterceptor)
export class UpdateLogsController {
  private logger: Logger;

  constructor(
    private readonly loggerService: Logger,
    private readonly updateLogsService: UpdateLogsService,
  ) {
    this.logger = loggerService;
  }

  private sendCustomResponse(
    res: Response,
    status: number,
    message: string | Record<string, any>,
  ) {
    const errorMessage = message instanceof Error ? message.message : message;
    return res.status(status).json({
      status,
      data: errorMessage,
    });
  }

  @Post('/product/update')
  async updateProduct(@Body() body: any, @Res() res: Response): Promise<any> {
    try {
      await this.updateLogsService.updateProduct(body);
      return res.status(HttpStatus.OK).json(body);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return res.status(HttpStatus.MISDIRECTED).json({
        status: HttpStatus.MISDIRECTED,
        data: error.message,
      });
    }
  }

  @Get('/product/logs')
  async getProducts(@Res() res: Response): Promise<any> {
    try {
      return this.sendCustomResponse(
        res,
        HttpStatus.OK,
        await this.updateLogsService.getAllLogs(),
      );
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return this.sendCustomResponse(
        res,
        HttpStatus.MISDIRECTED,
        'Somthing went wrong!',
      );
    }
  }
}
