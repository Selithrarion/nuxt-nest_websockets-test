import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

class RegisterDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(20)
	username: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	password: string;
}

export default RegisterDto;
