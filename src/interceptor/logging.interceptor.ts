import {
  CallHandler,
  ExecutionContext,
  Injectable,
  // Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import logger from 'src/utils/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    logger.info(`${method} ${url}`);
    logger.debug(req.body);

    return next.handle().pipe(
      tap(() => {
        logger.info(`Total time: ${Date.now() - now}ms`);
      }),
    );
  }
}
