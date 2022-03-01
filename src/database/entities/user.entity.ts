import { Task } from './task.entity';
import { Column, CreateDateColumn, Entity, Exclusion, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Role from '../../config/role.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.user
  })
  public role: Role;

  @OneToMany(() => Task, (task) => task.user, { onDelete: 'CASCADE', eager: true })
  tasks: Task[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
