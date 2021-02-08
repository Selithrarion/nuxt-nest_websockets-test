import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from '../users/user.entity';

@Entity()
export default class MessageEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public content: string;

	@ManyToOne(() => UserEntity)
	public author: UserEntity;
}
