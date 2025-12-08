import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CareerCurriculum } from './career-curriculum.entity';
import { CourseAccess } from '../../access/entities/course-access.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';
import { CompanyAccess } from '../../access/entities/company-access.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Lesson } from './lesson.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  professor_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'professor_id' })
  professor: User;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 150.0 })
  base_price: number;

  @Column({ type: 'float', nullable: true })
  revenue_share_pct: number;

  @Column({ type: 'boolean', default: false })
  is_shared_access: boolean;

  @Column()
  credits: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  rubric: string;

  @OneToMany(() => CareerCurriculum, (curriculum) => curriculum.course)
  careerCurriculums: CareerCurriculum[];

  @OneToMany(() => CourseAccess, (access) => access.course)
  accesses: CourseAccess[];

  @OneToMany(() => Submission, (submission) => submission.course)
  submissions: Submission[];

  @OneToMany(() => Certificate, (certificate) => certificate.course)
  certificates: Certificate[];

  @OneToMany(() => CompanyAccess, (companyAccess) => companyAccess.course)
  companyAccesses: CompanyAccess[];

  @OneToMany(() => Transaction, (transaction) => transaction.course)
  transactions: Transaction[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
}

