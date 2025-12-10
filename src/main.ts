import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Logging de variables de entorno al inicio
  console.log('🚀 Starting application...');
  console.log('📋 Environment Variables:');
  console.log(`  DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
  console.log(`  DB_PORT: ${process.env.DB_PORT || 'NOT SET'}`);
  console.log(`  DB_USERNAME: ${process.env.DB_USERNAME || 'NOT SET'}`);
  console.log(`  DB_DATABASE: ${process.env.DB_DATABASE || 'NOT SET'}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
  console.log(`  PORT: ${process.env.PORT || 'NOT SET'}`);
  
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://learning.getdevtools.com',
        'http://localhost:3000',
        'http://localhost:3001',
      ];
      // Permitir requests sin origin (mobile apps, Postman, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permitir todos por ahora para debug
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}`);
}

bootstrap();

