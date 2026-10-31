import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prefix = process.env.API_PREFIX ?? 'prueba/api/v1';
  app.setGlobalPrefix(prefix);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'cambiar-en-produccion',
      saveUninitialized: false,
      resave: false,
    }),
  );
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user: Express.User, done) => done(null, user));
  app.use(passport.initialize());
  app.use(passport.session());

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('API de prueba')
      .setDescription('Backend NestJS con login federado SAML (UCOL)')
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup(`${prefix}/docs`, app, doc);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
await bootstrap();
