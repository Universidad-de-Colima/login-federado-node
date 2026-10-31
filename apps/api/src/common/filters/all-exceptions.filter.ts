import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  ForbiddenException,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { HTTP_FAIL, ResponseAdapter } from '../adapters/response.adapter.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    let message = 'Error interno del servidor';
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      const raw = typeof body === 'string' ? body : (body as any).message;
      message = Array.isArray(raw) ? raw.join(', ') : String(raw ?? exception.message);
    }

    // Regla de negocio: toda falla responde 500, salvo autenticación (401) y
    // autorización (403). Siempre con el envoltorio normalizado.
    const status =
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
        ? exception.getStatus()
        : HTTP_FAIL;
    // 401/403 son esperados (p. ej. /auth/me sin sesión): una línea, sin stack.
    if (status === HTTP_FAIL) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    } else {
      this.logger.warn(`${status} ${message}`);
    }
    res.status(status).json(ResponseAdapter.fail(message));
  }
}
