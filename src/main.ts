import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                  // remueve las propiedades que no estan en el DTO
      forbidNonWhitelisted: true,       // envia un mensaje de error, en caso de que existan propiedades no declaradas en el DTO
      transform: true,                  // transforma el tipo de datos recibido según el tipo de datos declarado en el DTO
      transformOptions: {               // 
        enableImplicitConversion: true
      }
    })
  )
  
  await app.listen( process.env.PORT );
}
bootstrap();
