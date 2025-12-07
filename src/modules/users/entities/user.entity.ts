import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { IdentityAudit } from './identity-audit.entity';
import { Wallet } from '../../wallets/entities/wallet.entity';
import { Course } from '../../courses/entities/course.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { CourseAccess } from '../../access/entities/course-access.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  PROFESOR = 'profesor',
  ALUMNO = 'alumno',
  RECLUTADOR = 'reclutador',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  dni: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.ALUMNO,
  })
  role: UserRole;

  @Column({ nullable: true })
  linkedin_url: string;

  @Column({ nullable: true })
  github_url: string;

  @Column({ nullable: true })
  portfolio_url: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => IdentityAudit, (identityAudit) => identityAudit.user)
  identityAudit: IdentityAudit;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @OneToMany(() => Course, (course) => course.professor)
  courses: Course[];

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions: Submission[];

  @OneToMany(() => CourseAccess, (access) => access.student)
  courseAccesses: CourseAccess[];

  @OneToMany(() => Transaction, (transaction) => transaction.student)
  transactions: Transaction[];

  @OneToMany(() => Certificate, (certificate) => certificate.user)
  certificates: Certificate[];
}

