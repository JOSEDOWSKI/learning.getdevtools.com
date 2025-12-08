import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { LessonProgress } from './entities/lesson-progress.entity';
import { Lesson } from '../courses/entities/lesson.entity';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonProgress)
    private progressRepository: Repository<LessonProgress>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    private coursesService: CoursesService,
  ) {}

  async getLessonWithProgress(lessonId: number, studentId: number) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['course'],
    });

    if (!lesson) {
      throw new NotFoundException('Lección no encontrada');
    }

    // Verificar acceso al curso
    const hasAccess = await this.coursesService.checkCourseAccess(
      lesson.course_id,
      studentId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('No tienes acceso a este curso');
    }

    const progress = await this.progressRepository.findOne({
      where: {
        student_id: studentId,
        lesson_id: lessonId,
      },
    });

    return {
      ...lesson,
      progress: progress || {
        is_completed: false,
        progress_percentage: 0,
        video_time_watched: 0,
        notes: null,
      },
    };
  }

  async updateProgress(
    lessonId: number,
    studentId: number,
    data: {
      is_completed?: boolean;
      progress_percentage?: number;
      video_time_watched?: number;
    },
  ) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['course'],
    });

    if (!lesson) {
      throw new NotFoundException('Lección no encontrada');
    }

    // Verificar acceso
    const hasAccess = await this.coursesService.checkCourseAccess(
      lesson.course_id,
      studentId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('No tienes acceso a este curso');
    }

    let progress = await this.progressRepository.findOne({
      where: {
        student_id: studentId,
        lesson_id: lessonId,
      },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        student_id: studentId,
        lesson_id: lessonId,
        ...data,
      });
    } else {
      Object.assign(progress, data);
    }

    return this.progressRepository.save(progress);
  }

  async updateNotes(lessonId: number, studentId: number, notes: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['course'],
    });

    if (!lesson) {
      throw new NotFoundException('Lección no encontrada');
    }

    // Verificar acceso
    const hasAccess = await this.coursesService.checkCourseAccess(
      lesson.course_id,
      studentId,
    );

    if (!hasAccess) {
      throw new ForbiddenException('No tienes acceso a este curso');
    }

    let progress = await this.progressRepository.findOne({
      where: {
        student_id: studentId,
        lesson_id: lessonId,
      },
    });

    if (!progress) {
      progress = this.progressRepository.create({
        student_id: studentId,
        lesson_id: lessonId,
        notes,
      });
    } else {
      progress.notes = notes;
    }

    return this.progressRepository.save(progress);
  }

  async getCourseProgress(courseId: number, studentId: number) {
    const lessons = await this.lessonRepository.find({
      where: { course_id: courseId },
      order: { order_index: 'ASC' },
    });

    const lessonIds = lessons.map((l) => l.id);
    const progressList = lessonIds.length > 0
      ? await this.progressRepository.find({
          where: {
            student_id: studentId,
            lesson_id: In(lessonIds),
          },
        })
      : [];

    const progressMap = new Map(
      progressList.map((p) => [p.lesson_id, p]),
    );

    const totalLessons = lessons.length;
    const completedLessons = progressList.filter((p) => p.is_completed).length;
    const overallProgress = totalLessons > 0 
      ? (completedLessons / totalLessons) * 100 
      : 0;

    return {
      totalLessons,
      completedLessons,
      overallProgress,
      lessons: lessons.map((lesson) => ({
        ...lesson,
        progress: progressMap.get(lesson.id) || {
          is_completed: false,
          progress_percentage: 0,
          video_time_watched: 0,
          notes: null,
        },
      })),
    };
  }
}

