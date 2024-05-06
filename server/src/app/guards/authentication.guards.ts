import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Token must be provided');
    }
    try {
      const { payload } = jwt.decode(token, {
        complete: true,
      });
      request['user'] = payload;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new UnauthorizedException();
    }

    return true;
  }
}
