import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { HTTP_OK, ResponseAdapter } from '../adapters/response.adapter.js';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const res = ctx.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        res.status(HTTP_OK);
        return ResponseAdapter.isEnvelope(data) ? data : ResponseAdapter.ok(data);
      }),
    );
  }
}
