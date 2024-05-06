import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { DatabaseModule } from '../../../config/database.module';
import { AuthModule } from './auth.module';
import { ProductModule } from './product.module';
import { UpdateLogsModule } from './update-logs.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ProductModule,
    UpdateLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
