import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const PORT = process.env.PORT;
  app.enableCors();

  await app.listen(PORT || 3000);
}

bootstrap();
