import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { Submission } from './entities/submission.entity';
import { AiEvaluation } from './entities/ai-evaluation.entity';
import { Course } from '../courses/entities/course.entity';
import { CourseAccess } from '../access/entities/course-access.entity';
import { OpenAIService } from './services/openai.service';
import { GeminiService } from './services/gemini.service';
import { AiProviderFactory } from './services/ai-provider.factory';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, AiEvaluation, Course, CourseAccess]),
    ConfigModule,
  ],
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    OpenAIService,
    GeminiService,
    AiProviderFactory,
  ],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}

