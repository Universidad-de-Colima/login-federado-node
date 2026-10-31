import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/** Permite el paso solo si hay una sesión SAML activa. */
@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException('Sin sesión');
    return true;
  }
}
