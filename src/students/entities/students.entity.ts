import {
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Classes } from './classes.entity';
@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  user: string;

  @Column({ type: 'varchar', nullable: true })
  desc: string;

  @Column({ type: 'int', nullable: true })
  sex: number;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;

  @ManyToOne(() => Classes, (classes) => classes.students)
  class: Classes;
}
