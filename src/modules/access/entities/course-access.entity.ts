import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

export enum AccessType {
  PURCHASED = 'purchased',
  COMPANY_SEAT = 'company_seat',
  SCHOLARSHIP = 'scholarship',
}

@Entity('course_access')
export class CourseAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column()
  course_id: number;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({
    type: 'varchar',
    enum: AccessType,
  })
  access_type: AccessType;

  @Column({ nullable: true })
  transaction_id: number;

  @ManyToOne(() => Transaction, { nullable: true })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}

