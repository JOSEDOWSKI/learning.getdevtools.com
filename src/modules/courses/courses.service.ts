import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Career } from './entities/career.entity';
import { CareerCurriculum } from './entities/career-curriculum.entity';
import { Lesson } from './entities/lesson.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CareerStatus } from './entities/career.entity';
import { CourseAccess } from '../access/entities/course-access.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(CareerCurriculum)
    private curriculumRepository: Repository<CareerCurriculum>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(CourseAccess)
    private courseAccessRepository: Repository<CourseAccess>,
  ) {}

  // Courses
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      relations: ['professor'],
    });
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['professor', 'careerCurriculums', 'careerCurriculums.career'],
    });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    await this.courseRepository.update(id, updateCourseDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.courseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
  }

  // Careers
  async createCareer(createCareerDto: CreateCareerDto): Promise<Career> {
    const career = this.careerRepository.create({
      ...createCareerDto,
      status: createCareerDto.status || CareerStatus.DRAFT,
    });
    return this.careerRepository.save(career);
  }

  async findAllCareers(): Promise<Career[]> {
    return this.careerRepository.find({
      relations: ['curriculum', 'curriculum.course'],
      order: {
        curriculum: {
          order_index: 'ASC',
        },
      },
    });
  }

  async findOneCareer(id: number): Promise<Career> {
    const career = await this.careerRepository.findOne({
      where: { id },
      relations: ['curriculum', 'curriculum.course', 'curriculum.course.professor'],
      order: {
        curriculum: {
          order_index: 'ASC',
        },
      },
    });
    if (!career) {
      throw new NotFoundException(`Carrera con ID ${id} no encontrada`);
    }
    return career;
  }

  async updateCareer(id: number, updateCareerDto: UpdateCareerDto): Promise<Career> {
    await this.careerRepository.update(id, updateCareerDto);
    return this.findOneCareer(id);
  }

  async removeCareer(id: number): Promise<void> {
    const result = await this.careerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Carrera con ID ${id} no encontrada`);
    }
  }

  // Curriculum
  async addCourseToCareer(
    careerId: number,
    courseId: number,
    orderIndex: number,
  ): Promise<CareerCurriculum> {
    const curriculum = this.curriculumRepository.create({
      career_id: careerId,
      course_id: courseId,
      order_index: orderIndex,
    });
    return this.curriculumRepository.save(curriculum);
  }

  async removeCourseFromCareer(careerId: number, courseId: number): Promise<void> {
    const result = await this.curriculumRepository.delete({
      career_id: careerId,
      course_id: courseId,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Relación no encontrada');
    }
  }

  // Lessons
  async createLesson(createLessonDto: CreateLessonDto, professorId: number): Promise<Lesson> {
    // Verificar que el curso existe y pertenece al profesor
    const course = await this.findOne(createLessonDto.course_id);
    if (course.professor_id !== professorId) {
      throw new ForbiddenException('No tienes permiso para agregar lecciones a este curso');
    }

    // Si no se especifica order_index, calcular el siguiente
    if (createLessonDto.order_index === undefined) {
      const existingLessons = await this.lessonRepository.find({
        where: { course_id: createLessonDto.course_id },
        order: { order_index: 'DESC' },
        take: 1,
      });
      createLessonDto.order_index = existingLessons.length > 0 
        ? existingLessons[0].order_index + 1 
        : 0;
    }

    const lesson = this.lessonRepository.create(createLessonDto);
    return this.lessonRepository.save(lesson);
  }

  async findAllLessons(courseId: number): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { course_id: courseId },
      order: { order_index: 'ASC' },
    });
  }

  async findOneLesson(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['course'],
    });
    if (!lesson) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada`);
    }
    return lesson;
  }

  async updateLesson(id: number, updateLessonDto: UpdateLessonDto, professorId: number): Promise<Lesson> {
    const lesson = await this.findOneLesson(id);
    
    // Verificar que el curso pertenece al profesor
    const course = await this.findOne(lesson.course_id);
    if (course.professor_id !== professorId) {
      throw new ForbiddenException('No tienes permiso para editar esta lección');
    }

    await this.lessonRepository.update(id, updateLessonDto);
    return this.findOneLesson(id);
  }

  async updateLessonFile(
    id: number,
    fileType: 'video' | 'pdf',
    fileUrl: string,
    filename: string,
    professorId: number,
  ): Promise<Lesson> {
    const lesson = await this.findOneLesson(id);
    
    // Verificar que el curso pertenece al profesor
    const course = await this.findOne(lesson.course_id);
    if (course.professor_id !== professorId) {
      throw new ForbiddenException('No tienes permiso para editar esta lección');
    }

    const updateData: any = {};
    if (fileType === 'video') {
      updateData.video_url = fileUrl;
      updateData.video_filename = filename;
    } else {
      updateData.pdf_url = fileUrl;
      updateData.pdf_filename = filename;
    }

    await this.lessonRepository.update(id, updateData);
    return this.findOneLesson(id);
  }

  async removeLesson(id: number, professorId: number): Promise<void> {
    const lesson = await this.findOneLesson(id);
    
    // Verificar que el curso pertenece al profesor
    const course = await this.findOne(lesson.course_id);
    if (course.professor_id !== professorId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta lección');
    }

    const result = await this.lessonRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Lección con ID ${id} no encontrada`);
    }
  }

  async checkCourseAccess(courseId: number, studentId: number): Promise<boolean> {
    const access = await this.courseAccessRepository.findOne({
      where: {
        student_id: studentId,
        course_id: courseId,
        is_active: true,
      },
    });
    return !!access;
  }
}

