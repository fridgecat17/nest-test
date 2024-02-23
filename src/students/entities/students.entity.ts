import {
  ManyToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Classes } from '../../class/entities/classes.entity';
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

  @Column({ default: false })
  isDel: boolean;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;

  @ManyToOne(() => Classes, (classes) => classes.students)
  @JoinColumn({ name: 'classId' })
  public class: Classes;
}
