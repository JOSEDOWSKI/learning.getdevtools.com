import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PayoutStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

@Entity('payouts')
export class Payout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  professor_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'professor_id' })
  professor: User;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({
    type: 'varchar',
    enum: PayoutStatus,
    default: PayoutStatus.PENDING,
  })
  status: PayoutStatus;

  @Column({ nullable: true })
  transaction_ref: string;

  @CreateDateColumn()
  created_at: Date;
}

