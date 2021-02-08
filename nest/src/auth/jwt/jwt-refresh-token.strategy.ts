import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { request } from 'express';
import TokenPayloadInterface from '../interfaces/tokenPayload.interface';

@Injectable()
export default class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh-token'
) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => {
					return request.cookies.Refresh;
				},
			]),
			secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: TokenPayloadInterface) {
		const refreshToken = request.cookies.Refresh;
		return this.usersService.getUserIfRefreshTokenMatches(
			refreshToken,
			payload.id
		);
	}
}
