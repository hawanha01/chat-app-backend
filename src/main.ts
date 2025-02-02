import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenvConfig } from 'dotenv';
import { TransformInterceptor } from './pipes/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableCors();
  dotenvConfig();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
