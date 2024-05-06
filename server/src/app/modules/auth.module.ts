import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from '../schemas/auth.schemas';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { Logger } from '../services/logger.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/auth/constants';
import { AuthenticationGuard } from '../guards/authentication.guards';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger, AuthenticationGuard],
})
export class AuthModule {}
