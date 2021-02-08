import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import UserEntity from './user.entity';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>
	) {}

	// USER

	async getByUsername(username: string) {
		const user = await this.usersRepository.findOne({ username });
		if (user) {
			return user;
		}
		throw new HttpException(
			'Пользователь с таким логином не существует',
			HttpStatus.NOT_FOUND
		);
	}

	async getById(id: number) {
		const user = await this.usersRepository.findOne({ id });
		if (user) {
			return user;
		}
		throw new HttpException(
			'Пользователь с таким id не существует',
			HttpStatus.NOT_FOUND
		);
	}

	async create(userData: CreateUserDto) {
		const newUser = await this.usersRepository.create(userData);
		await this.usersRepository.save(newUser);
		return newUser;
	}

	// TOKENS

	async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
		const user = await this.getById(id);

		const isRefreshTokenMatching = await bcrypt.compare(
			refreshToken,
			user.currentHashedRefreshToken
		);

		if (isRefreshTokenMatching) {
			return user;
		}
		throw new HttpException(
			'Произошла непредвиденная ошибка',
			HttpStatus.BAD_REQUEST
		);
	}

	async setCurrentRefreshToken(refreshToken: string, id: number) {
		const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
		await this.usersRepository.update(id, { currentHashedRefreshToken });
	}

	async removeRefreshToken(id: number) {
		return this.usersRepository.update(id, { currentHashedRefreshToken: null });
	}
}
