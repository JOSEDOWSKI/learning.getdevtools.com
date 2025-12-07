import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { AiEvaluation } from './ai-evaluation.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column()
  course_id: number;

  @ManyToOne(() => Course, (course) => course.submissions)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  project_url: string;

  @CreateDateColumn()
  submitted_at: Date;

  @OneToOne(() => AiEvaluation, (evaluation) => evaluation.submission)
  evaluation: AiEvaluation;
}

