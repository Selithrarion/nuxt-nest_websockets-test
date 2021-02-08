import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export default class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(20)
	username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	password: string;
}
