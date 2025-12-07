import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

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
    const courseId = parseInt(id, 10);
    if (isNaN(courseId) || courseId <= 0) {
      throw new BadRequestException('ID de curso inválido');
    }
    return this.coursesService.findOne(courseId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    const courseId = parseInt(id, 10);
    if (isNaN(courseId) || courseId <= 0) {
      throw new BadRequestException('ID de curso inválido');
    }
    return this.coursesService.update(courseId, updateCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    const courseId = parseInt(id, 10);
    if (isNaN(courseId) || courseId <= 0) {
      throw new BadRequestException('ID de curso inválido');
    }
    return this.coursesService.remove(courseId);
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
    const parsedCareerId = parseInt(careerId, 10);
    const parsedCourseId = parseInt(courseId, 10);
    if (isNaN(parsedCareerId) || parsedCareerId <= 0) {
      throw new BadRequestException('ID de carrera inválido');
    }
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      throw new BadRequestException('ID de curso inválido');
    }
    return this.coursesService.addCourseToCareer(parsedCareerId, parsedCourseId, orderIndex);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('careers/:careerId/courses/:courseId')
  removeCourseFromCareer(
    @Param('careerId') careerId: string,
    @Param('courseId') courseId: string,
  ) {
    const parsedCareerId = parseInt(careerId, 10);
    const parsedCourseId = parseInt(courseId, 10);
    if (isNaN(parsedCareerId) || parsedCareerId <= 0) {
      throw new BadRequestException('ID de carrera inválido');
    }
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      throw new BadRequestException('ID de curso inválido');
    }
    return this.coursesService.removeCourseFromCareer(parsedCareerId, parsedCourseId);
  }
}

