import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getLesson(@Param('id') id: string, @Request() req) {
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      throw new BadRequestException('ID de lección inválido');
    }
    const studentId = req.user.sub;
    return this.lessonsService.getLessonWithProgress(lessonId, studentId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/progress')
  async updateProgress(
    @Param('id') id: string,
    @Body() body: {
      is_completed?: boolean;
      progress_percentage?: number;
      video_time_watched?: number;
    },
    @Request() req,
  ) {
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      throw new BadRequestException('ID de lección inválido');
    }
    const studentId = req.user.sub;
    return this.lessonsService.updateProgress(lessonId, studentId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/notes')
  async updateNotes(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @Request() req,
  ) {
    const lessonId = parseInt(id, 10);
    if (isNaN(lessonId) || lessonId <= 0) {
      throw new BadRequestException('ID de lección inválido');
    }
    const studentId = req.user.sub;
    return this.lessonsService.updateNotes(lessonId, studentId, notes);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('course/:courseId/progress')
  async getCourseProgress(@Param('courseId') courseId: string, @Request() req) {
    const parsedCourseId = parseInt(courseId, 10);
    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
      throw new BadRequestException('ID de curso inválido');
    }
    const studentId = req.user.sub;
    return this.lessonsService.getCourseProgress(parsedCourseId, studentId);
  }
}

