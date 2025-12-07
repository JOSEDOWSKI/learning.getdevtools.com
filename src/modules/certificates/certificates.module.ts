import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { Certificate } from './entities/certificate.entity';
import { CourseAccess } from '../access/entities/course-access.entity';
import { Career } from '../courses/entities/career.entity';
import { CareerCurriculum } from '../courses/entities/career-curriculum.entity';
import { AiEvaluation } from '../submissions/entities/ai-evaluation.entity';
import { Submission } from '../submissions/entities/submission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certificate,
      CourseAccess,
      Career,
      CareerCurriculum,
      AiEvaluation,
      Submission,
    ]),
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}

