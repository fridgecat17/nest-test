import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class UserEntity {
  // constructor(user: Partial<UserEntity>) {
  //   Object.assign(this, user);
  // }
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', charset: 'utf8mb4', default: '匿名用户' })
  nickname: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column()
  memo_count: number;

  @Column()
  day_count: number;

  @Column()
  tag_count: number;

  @Column()
  month_sign_id: number;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column()
  last_login: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createTime: string;
}
