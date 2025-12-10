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
import { LessonProgress } from '../modules/lessons/entities/lesson-progress.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbHost = this.configService.get<string>('DB_HOST');
    const dbPort = this.configService.get<number>('DB_PORT', 5432);
    const dbUsername = this.configService.get<string>('DB_USERNAME', 'postgres');
    const dbPassword = this.configService.get<string>('DB_PASSWORD', 'postgres');
    const dbDatabase = this.configService.get<string>('DB_DATABASE', 'learning_platform');
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');

    // Logging para diagnóstico
    console.log('🔍 Database Configuration:');
    console.log(`  DB_HOST: ${dbHost || 'NOT SET (using localhost fallback)'}`);
    console.log(`  DB_PORT: ${dbPort}`);
    console.log(`  DB_USERNAME: ${dbUsername}`);
    console.log(`  DB_DATABASE: ${dbDatabase}`);
    console.log(`  NODE_ENV: ${nodeEnv}`);

    // En producción, no usar localhost como fallback
    if (nodeEnv === 'production' && (!dbHost || dbHost === 'localhost')) {
      console.error('❌ ERROR: DB_HOST no está configurado en producción!');
      console.error('   Configura DB_HOST=srv-captain--postgresqllearning en CapRover');
      throw new Error('DB_HOST must be configured in production environment');
    }

    return {
      type: 'postgres',
      host: dbHost || 'localhost',
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbDatabase,
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
        LessonProgress,
        Transaction,
        CourseAccess,
        CompanyAccess,
        Submission,
        AiEvaluation,
        SkillsMatrix,
        Certificate,
        AdminAuditLog,
      ],
      synchronize: true, // Habilitado para crear tablas automáticamente
      logging: this.configService.get<string>('NODE_ENV') === 'development',
    };
  }
}

