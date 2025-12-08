import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { IdentityAudit } from '../modules/users/entities/identity-audit.entity';
import { PlatformSettings } from '../modules/admin/entities/platform-settings.entity';
import { Wallet } from '../modules/wallets/entities/wallet.entity';
import { Payout } from '../modules/wallets/entities/payout.entity';
import { Career } from '../modules/courses/entities/career.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { CareerCurriculum } from '../modules/courses/entities/career-curriculum.entity';
import { Transaction } from '../modules/transactions/entities/transaction.entity';
import { CourseAccess } from '../modules/access/entities/course-access.entity';
import { CompanyAccess } from '../modules/access/entities/company-access.entity';
import { Submission } from '../modules/submissions/entities/submission.entity';
import { AiEvaluation } from '../modules/submissions/entities/ai-evaluation.entity';
import { SkillsMatrix } from '../modules/skills/entities/skills-matrix.entity';
import { Certificate } from '../modules/certificates/entities/certificate.entity';
import { AdminAuditLog } from '../modules/admin/entities/admin-audit-log.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';
import { Lesson } from '../modules/courses/entities/lesson.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'postgres'),
      database: this.configService.get<string>('DB_DATABASE', 'learning_platform'),
          entities: [
            User,
            IdentityAudit,
            PlatformSettings,
            Wallet,
            Payout,
            Career,
            Course,
            CareerCurriculum,
            Lesson,
            Transaction,
            CourseAccess,
            CompanyAccess,
            Submission,
            AiEvaluation,
            SkillsMatrix,
            Certificate,
            AdminAuditLog,
          ],
      synchronize: this.configService.get<string>('NODE_ENV') === 'development' || this.configService.get<string>('NODE_ENV') === 'production',
      logging: this.configService.get<string>('NODE_ENV') === 'development',
    };
  }
}

