import { Module } from '@nestjs/common';
import { MongoDBLoggerService } from '../services/mongodb-logger.service';
import { UpdateLogsController } from '../controllers/update.logs.controller';
import { UpdateLogsService } from '../services/update-logs.service';
import { Logger } from '../services/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../schemas/product.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [UpdateLogsController],
  providers: [Logger, UpdateLogsService, MongoDBLoggerService],
})
export class UpdateLogsModule {}
