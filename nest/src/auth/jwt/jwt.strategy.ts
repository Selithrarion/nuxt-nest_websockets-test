import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import TokenPayloadInterface from '../interfaces/tokenPayload.interface';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => {
					return request.cookies.Authentication;
				},
			]),
			secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
		});
	}

	async validate(payload: TokenPayloadInterface) {
		return this.usersService.getById(payload.id);
	}
}
