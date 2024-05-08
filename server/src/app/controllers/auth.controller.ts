import { Response } from 'express';
import {
  Controller,
  HttpStatus,
  Res,
  Inject,
  Post,
  Body,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthControllerDto } from '../dto/auth.controller.dto';
import { Logger } from '../services/logger.service';
import { AuthenticationGuard } from '../guards/authentication.guards';

@Controller('/api/v1/user/auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  private logger: Logger;

  @Inject() private service: AuthService;
  constructor(private readonly loggerService: Logger) {
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

  @Post('/sign-in')
  async SignIn(
    @Res() res: Response,
    @Body() auth: AuthControllerDto,
  ): Promise<Response> {
    try {
      const result: any = await this.service.SignIn(auth);
      return this.sendCustomResponse(res, result.status, result.data);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return this.sendCustomResponse(
        res,
        HttpStatus.UNPROCESSABLE_ENTITY,
        error.message,
      );
    }
  }

  @UseGuards(AuthenticationGuard)
  @Get('/data')
  async getUserDetails(
    @Res() res: Response,
    @Query('id') id: string,
  ): Promise<Response> {
    try {
      const result: any = await this.service.getUser(id);
      return this.sendCustomResponse(res, HttpStatus.OK, result);
    } catch (error) {
      // this.logger.error(error.message, error.stack);
      return this.sendCustomResponse(res, HttpStatus.MISDIRECTED, error);
    }
  }
}
