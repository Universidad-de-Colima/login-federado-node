import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { SamlStrategy } from './saml.strategy.js';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [SamlStrategy],
})
export class AuthModule {}
