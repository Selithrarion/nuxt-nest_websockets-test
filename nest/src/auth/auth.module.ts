import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import LocalStrategy from './local/local.strategy';
import JwtStrategy from './jwt/jwt.strategy';
import JwtRefreshTokenStrategy from './jwt/jwt-refresh-token.strategy';

@Module({
	imports: [UsersModule, PassportModule, JwtModule.register({})],
	providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
