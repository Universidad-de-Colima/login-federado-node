import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { SamlAuthGuard } from './saml-auth.guard.js';
import { SamlStrategy } from './saml.strategy.js';
import { SessionGuard } from './session.guard.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly frontUrl: string;

  constructor(
    private readonly saml: SamlStrategy,
    config: ConfigService,
  ) {
    this.frontUrl = config.get('FRONT_URL', '/');
  }

  @Get('login')
  @UseGuards(SamlAuthGuard)
  @ApiOperation({ summary: 'Inicia el SSO: redirige al IdP de UCOL' })
  login() {
    // El guard redirige al IdP; aquí solo se llega con sesión válida.
  }

  @Post('login/callback')
  @UseGuards(SamlAuthGuard)
  @ApiOperation({ summary: 'Recibe la respuesta SAML del IdP y redirige al front' })
  loginCallback(@Res() res: Response) {
    // Sesión ya creada por el guard: se devuelve al usuario al front.
    res.redirect(this.frontUrl);
  }

  @Get('me')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Perfil del usuario con sesión activa' })
  me(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  @ApiOperation({ summary: 'Cierra sesión en la app y en el IdP' })
  logout(@Req() req: Request, @Res() res: Response) {
    if (!req.user) return res.redirect(this.frontUrl);
    this.saml.logout(req as never, (err, url) => {
      if (err || !url) return res.status(500).send('Error al cerrar sesión');
      res.redirect(url);
    });
  }

  @Post('logout/callback')
  @ApiOperation({ summary: 'Cierra la sesión local cuando el IdP responde' })
  logoutCallback(@Req() req: Request, @Res() res: Response) {
    req.logout(() => res.redirect(this.frontUrl));
  }

  @Get('metadata')
  @ApiOperation({ summary: 'Metadatos XML del SP (se entregan a UCOL)' })
  metadata(@Res() res: Response) {
    res.type('application/xml').send(this.saml.metadata());
  }
}
