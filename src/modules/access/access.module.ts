import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessService } from './access.service';
import { AccessController } from './access.controller';
import { CourseAccess } from './entities/course-access.entity';
import { CompanyAccess } from './entities/company-access.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseAccess, CompanyAccess, Course])],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}

