import { Message } from 'src/modules/pusher/entity/message.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'email',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ type: 'varchar', length: 225, name: 'first_name', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 225, name: 'last_name', nullable: false })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'profile_image',
    nullable: true,
  })
  profileImage: string;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    default: null,
  })
  deletedAt: Date;
}
