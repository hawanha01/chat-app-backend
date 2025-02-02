import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const excludedUrl = ['/pusher/auth'];
    return next.handle().pipe(
      map((result) => {
        // const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        // if (excludedUrl.includes(request.url)) return;
        const statusCode = response.statusCode || HttpStatus.OK;
        const message = result?.message
          ? result.message
          : Array.isArray(result)
            ? 'Data retrieved successfully'
            : 'Operation completed successfully';

        if (result?.message) {
          delete result.message;
        }
        const isEmpty = Object.keys(result || {}).length === 0;
        return {
          statusCode,
          message,
          data: isEmpty ? undefined : result,
        };
      }),
      catchError((error) => {
        if (error.response?.errors) {
          return throwError(() => error);
        }

        return throwError(() => ({
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'An error occurred',
        }));
      }),
    );
  }
}
