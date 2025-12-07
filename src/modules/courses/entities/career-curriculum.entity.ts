import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Career } from './career.entity';
import { Course } from './course.entity';

@Entity('career_curriculum')
export class CareerCurriculum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  career_id: number;

  @ManyToOne(() => Career, (career) => career.curriculum)
  @JoinColumn({ name: 'career_id' })
  career: Career;

  @Column()
  course_id: number;

  @ManyToOne(() => Course, (course) => course.careerCurriculums)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  order_index: number;
}

