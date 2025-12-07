import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { CareerCurriculum } from './career-curriculum.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

export enum CareerStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
}

@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  total_months: number;

  @Column({
    type: 'varchar',
    enum: CareerStatus,
    default: CareerStatus.DRAFT,
  })
  status: CareerStatus;

  @OneToMany(() => CareerCurriculum, (curriculum) => curriculum.career)
  curriculum: CareerCurriculum[];

  @OneToMany(() => Certificate, (certificate) => certificate.career)
  certificates: Certificate[];

  @OneToMany(() => Transaction, (transaction) => transaction.career)
  transactions: Transaction[];
}

