import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MongoDBLoggerService } from '../services/mongodb-logger.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: MongoDBLoggerService,
    private jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap(async () => {
        try {
          const { oldValue } = request.body;
          delete request.body.oldValue;
          const newValue = request.body;
          const userId = request.user ? request.user.sub : null;
          await this.logger.logChange(oldValue, newValue, userId);
        } catch (error) {
          return error;
        }
      }),
    );
  }
}
