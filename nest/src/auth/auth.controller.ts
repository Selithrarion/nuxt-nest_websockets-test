import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import RegisterDto from './dto/register.dto';
import LocalAuthGuard from './local/local-auth.guard';
import JwtAuthGuard from './jwt/jwt-auth.guard';
import JwtRefreshGuard from './jwt/jwt-refresh-token.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService
	) {}

	@UseGuards(JwtAuthGuard)
	@Get()
	authenticate(@Req() req) {
		const { user } = req;
		return user;
	}

	@Post('register')
	async register(@Body() regData: RegisterDto) {
		return this.authService.register(regData);
	}

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req, @Res() res) {
		const { user } = req;
		const userID = user.id;

		const accessTokenCookie = this.authService.getCookieWithAccessJwtToken(
			userID
		);
		const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
			userID
		);

		await this.usersService.setCurrentRefreshToken(refreshTokenCookie, userID);
		res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

		return user;
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Req() req, @Res() res) {
		await this.usersService.removeRefreshToken(req.user.id);
		res.setHeader('Set-Cookie', this.authService.getCookieForLogout());

		return res.sendStatus(200);
	}

	@UseGuards(JwtRefreshGuard)
	@Get('refresh')
	refresh(@Req() req, @Res() res) {
		const { user } = req;
		const accessTokenCookie = this.authService.getCookieWithAccessJwtToken(
			req.user
		);

		res.setHeader('Set-Cookie', accessTokenCookie);
		return user;
	}
}
