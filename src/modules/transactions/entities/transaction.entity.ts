import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Career } from '../../courses/entities/career.entity';

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum PaymentMethod {
  YAPE = 'Yape',
  PLIN = 'Plin',
  CARD = 'Card',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ nullable: true })
  course_id: number;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ nullable: true })
  career_id: number;

  @ManyToOne(() => Career, { nullable: true })
  @JoinColumn({ name: 'career_id' })
  career: Career;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'varchar',
    enum: PaymentMethod,
    nullable: true,
  })
  payment_method: PaymentMethod;

  @Column({
    type: 'varchar',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ nullable: true })
  transaction_ref: string;

  @CreateDateColumn()
  created_at: Date;
}

