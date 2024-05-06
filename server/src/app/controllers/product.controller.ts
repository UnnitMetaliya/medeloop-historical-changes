import { Response } from 'express';
import {
  Controller,
  HttpStatus,
  Res,
  Body,
  Post,
  UsePipes,
  Get,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { Logger } from '../services/logger.service';
import { ProductDto } from '../dto/product.dto';
import { ProductService } from '../services/product.service';
import { AuthenticationGuard } from '../guards/authentication.guards';

@Controller('/api/v1/')
@UsePipes(new ValidationPipe())
@UseGuards(AuthenticationGuard)
export class ProductController {
  private logger: Logger;

  constructor(
    private readonly loggerService: Logger,
    private productService: ProductService,
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

  @Post('product')
  async createProduct(
    @Body() product: ProductDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      console.log(product);
      const productObj = await this.productService.createProduct(product);
      return this.sendCustomResponse(res, HttpStatus.CREATED, productObj);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return res.status(HttpStatus.MISDIRECTED).json({
        status: HttpStatus.MISDIRECTED,
        data: error.message,
      });
    }
  }

  @Get('products')
  async getProducts(@Res() res: Response): Promise<any> {
    try {
      const productObj = await this.productService.getProducts();
      return this.sendCustomResponse(res, HttpStatus.OK, productObj);
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
