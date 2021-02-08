import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'cookie';
import { AuthService } from '../auth/auth.service';
import MessageEntity from './message.entity';
import UserEntity from '../users/user.entity';

@Injectable()
export class ChatService {
	constructor(
		private readonly authService: AuthService,
		@InjectRepository(MessageEntity)
		private messagesRepository: Repository<MessageEntity>
	) {}

	async getUserFromSocket(socket: Socket) {
		const cookie = socket.handshake.headers.cookie;
		const { Authentication: authToken } = parse(cookie);
		const user = await this.authService.getUserFromAuthToken(authToken);
		if (!user) {
			throw new WsException('Неверный логин или пароль');
		}
		return user;
	}

	async getAllMessages() {
		return this.messagesRepository.find({
			relations: ['author'],
		});
	}

	async saveMessage(content: string, author: UserEntity) {
		const newMessage = await this.messagesRepository.create({
			content,
			author,
		});
		await this.messagesRepository.save(newMessage);
		return newMessage;
	}
}
