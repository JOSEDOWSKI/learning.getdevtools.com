import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Career } from './entities/career.entity';
import { CareerCurriculum } from './entities/career-curriculum.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { CareerStatus } from './entities/career.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(CareerCurriculum)
    private curriculumRepository: Repository<CareerCurriculum>,
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
}

