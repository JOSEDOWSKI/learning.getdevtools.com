import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity('ai_evaluations')
export class AiEvaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  submission_id: number;

  @OneToOne(() => Submission, (submission) => submission.evaluation)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'text' })
  feedback_summary: string;

  @Column({ type: 'json' })
  rubric_breakdown: any;

  @Column()
  ai_model_version: string;

  @CreateDateColumn()
  processed_at: Date;
}

