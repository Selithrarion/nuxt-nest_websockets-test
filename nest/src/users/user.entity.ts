import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export default class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 20, unique: true })
	username: string;

	@Column({ nullable: true })
	@Exclude()
	currentHashedRefreshToken?: string;

	@Column()
	@Exclude()
	public password: string;
}
