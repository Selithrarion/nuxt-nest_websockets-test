import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import TokenPayloadInterface from './interfaces/tokenPayload.interface';
import RegisterDto from './dto/register.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async register(regData: RegisterDto) {
		const hashedPassword = await bcrypt.hash(regData.password, 10);
		try {
			const createdUser = await this.usersService.create({
				...regData,
				password: hashedPassword,
			});
			return createdUser;
		} catch (e) {
			throw new HttpException(
				'Такое имя пользоваля уже существует',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async getAuthUser(username: string, password: string) {
		try {
			const user = await this.usersService.getByUsername(username);
			await this.verifyPassword(password, user.password);
			return user;
		} catch (e) {
			throw new HttpException(
				'Неверный логин или пароль',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	private async verifyPassword(password: string, hashedPassword: string) {
		const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
		if (!isPasswordMatching) {
			throw new HttpException(
				'Неверный логин или пароль',
				HttpStatus.BAD_REQUEST
			);
		}
	}

	getCookieWithAccessJwtToken(id: number) {
		const payload: TokenPayloadInterface = { id };
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
			expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXP_TIME')}s`,
		});
		const cookie = `Authentication=${token}; Path=/; Max-Age=${this.configService.get(
			'JWT_ACCESS_TOKEN_EXP_TIME'
		)}`;
		return cookie;
	}
	getCookieWithJwtRefreshToken(id: number) {
		const payload: TokenPayloadInterface = { id };
		const token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
			expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXP_TIME')}s`,
		});
		const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
			'JWT_ACCESS_TOKEN_EXP_TIME'
		)}`;
		return cookie;
	}

	getCookieForLogout() {
		return [
			`Authentication=; HttpOnly; Path=/; Max-Age=0`,
			`Refresh=; HttpOnly; Path=/; Max-Age=0`,
		];
	}

	async getUserFromAuthToken(token: string) {
		const payload: TokenPayloadInterface = this.jwtService.verify(token, {
			secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
		});
		const userID = payload.id;

		if (userID) {
			return this.usersService.getById(userID);
		}
		throw new HttpException(
			'Произошла непредвиденная ошибка',
			HttpStatus.INTERNAL_SERVER_ERROR
		);
	}
}
