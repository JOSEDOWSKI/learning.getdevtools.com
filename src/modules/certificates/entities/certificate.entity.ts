import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Career } from '../../courses/entities/career.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.certificates)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  career_id: number;

  @ManyToOne(() => Career, { nullable: true })
  @JoinColumn({ name: 'career_id' })
  career: Career;

  @Column({ nullable: true })
  course_id: number;

  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ unique: true })
  hash_digital_signature: string;

  @Column({ type: 'boolean', default: false })
  is_national_title: boolean;

  @CreateDateColumn()
  issue_date: Date;
}

