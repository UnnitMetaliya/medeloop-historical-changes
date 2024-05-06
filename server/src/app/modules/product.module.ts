import { Module } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { Logger } from '../services/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../schemas/product.schemas';
import { MongoDBLoggerService } from '../services/mongodb-logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ProductController],
  providers: [ProductService, Logger, MongoDBLoggerService],
})
export class ProductModule {}
