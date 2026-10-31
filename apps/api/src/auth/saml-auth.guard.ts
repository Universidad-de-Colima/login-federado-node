import { type ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SamlAuthGuard extends AuthGuard('saml') {
  async canActivate(ctx: ExecutionContext) {
    const ok = (await super.canActivate(ctx)) as boolean;
    // AuthGuard solo valida: hay que abrir la sesión de passport para que
    // el usuario persista entre peticiones (GET /auth/me).
    await super.logIn(ctx.switchToHttp().getRequest());
    return ok;
  }
}
