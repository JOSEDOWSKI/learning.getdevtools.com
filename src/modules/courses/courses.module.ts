import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { Career } from './entities/career.entity';
import { CareerCurriculum } from './entities/career-curriculum.entity';
import { Lesson } from './entities/lesson.entity';
import { CourseAccess } from '../access/entities/course-access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Career, CareerCurriculum, Lesson, CourseAccess])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}

