import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		ConfigModule.forRoot({ isGlobal: true }),
		ChatModule,
		AuthModule,
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
