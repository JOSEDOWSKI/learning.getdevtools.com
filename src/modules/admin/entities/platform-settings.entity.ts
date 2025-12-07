import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('platform_settings')
export class PlatformSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 20.0 })
  platform_fee_pct: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500.0 })
  min_payout_amount: number;

  @Column({ type: 'boolean', default: false })
  is_maintenance_mode: boolean;
}

