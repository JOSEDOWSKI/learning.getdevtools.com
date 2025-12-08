import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
<<<<<<< HEAD
=======
  OneToMany,
>>>>>>> backend
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from './course.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_id: number;

  @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

<<<<<<< HEAD
=======
  @Column({ type: 'varchar', nullable: true })
  video_url: string;

  @Column({ type: 'varchar', nullable: true })
  pdf_url: string;

  @Column({ type: 'varchar', nullable: true })
  video_filename: string;

  @Column({ type: 'varchar', nullable: true })
  pdf_filename: string;

>>>>>>> backend
  @Column({ type: 'int', default: 0 })
  order_index: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

