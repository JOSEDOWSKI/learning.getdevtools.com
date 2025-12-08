import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }

  // Careers endpoints
  @UseGuards(AuthGuard('jwt'))
  @Post('careers')
  createCareer(@Body() createCareerDto: CreateCareerDto) {
    return this.coursesService.createCareer(createCareerDto);
  }

  @Get('careers')
  findAllCareers() {
    return this.coursesService.findAllCareers();
  }

  @Get('careers/:id')
  findOneCareer(@Param('id') id: string) {
    return this.coursesService.findOneCareer(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('careers/:id')
  updateCareer(@Param('id') id: string, @Body() updateCareerDto: UpdateCareerDto) {
    return this.coursesService.updateCareer(+id, updateCareerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('careers/:id')
  removeCareer(@Param('id') id: string) {
    return this.coursesService.removeCareer(+id);
  }

  // Curriculum endpoints
  @UseGuards(AuthGuard('jwt'))
  @Post('careers/:careerId/courses/:courseId')
  addCourseToCareer(
    @Param('careerId') careerId: string,
    @Param('courseId') courseId: string,
    @Body('orderIndex') orderIndex: number,
  ) {
    return this.coursesService.addCourseToCareer(+careerId, +courseId, orderIndex);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('careers/:careerId/courses/:courseId')
  removeCourseFromCareer(
    @Param('careerId') careerId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.coursesService.removeCourseFromCareer(+careerId, +courseId);
  }

  // Lessons endpoints
  @UseGuards(AuthGuard('jwt'))
  @Post('lessons')
  createLesson(@Body() createLessonDto: CreateLessonDto, @Request() req) {
    const professorId = req.user.sub;
    return this.coursesService.createLesson(createLessonDto, professorId);
  }

  @Get('courses/:courseId/lessons')
  findAllLessons(@Param('courseId') courseId: string) {
    const courseIdNum = parseInt(courseId, 10);
    if (isNaN(courseIdNum) || courseIdNum <= 0) {
      throw new BadRequestException('ID de curso inválido');
    }
    return this.coursesService.findAllLessons(courseIdNum);
  }

  @Get('lessons/:id')
  findOneLesson(@Param('id') id: string) {
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      throw new BadRequestException('ID de lección inválido');
    }
    return this.coursesService.findOneLesson(lessonId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('lessons/:id')
  updateLesson(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @Request() req,
  ) {
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      throw new BadRequestException('ID de lección inválido');
    }
    const professorId = req.user.sub;
    return this.coursesService.updateLesson(lessonId, updateLessonDto, professorId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('lessons/:id')
  removeLesson(@Param('id') id: string, @Request() req) {
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      throw new BadRequestException('ID de lección inválido');
    }
    const professorId = req.user.sub;
    return this.coursesService.removeLesson(lessonId, professorId);
  }
}

