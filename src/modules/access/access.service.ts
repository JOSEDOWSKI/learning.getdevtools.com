import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseAccess, AccessType } from './entities/course-access.entity';
import { CompanyAccess } from './entities/company-access.entity';
import { Course } from '../courses/entities/course.entity';
import { CreateAccessDto } from './dto/create-access.dto';
import { CreateCompanyAccessDto } from './dto/create-company-access.dto';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(CourseAccess)
    private courseAccessRepository: Repository<CourseAccess>,
    @InjectRepository(CompanyAccess)
    private companyAccessRepository: Repository<CompanyAccess>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async grantAccess(createAccessDto: CreateAccessDto): Promise<CourseAccess> {
    const course = await this.courseRepository.findOne({
      where: { id: createAccessDto.course_id },
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    // Verificar si ya existe acceso
    const existing = await this.courseAccessRepository.findOne({
      where: {
        student_id: createAccessDto.student_id,
        course_id: createAccessDto.course_id,
        is_active: true,
      },
    });

    if (existing) {
      return existing;
    }

    const access = this.courseAccessRepository.create({
      student_id: createAccessDto.student_id,
      course_id: createAccessDto.course_id,
      access_type: createAccessDto.access_type || AccessType.SCHOLARSHIP,
      transaction_id: createAccessDto.transaction_id,
      is_active: true,
    });

    return this.courseAccessRepository.save(access);
  }

  async revokeAccess(studentId: number, courseId: number): Promise<void> {
    const result = await this.courseAccessRepository.update(
      {
        student_id: studentId,
        course_id: courseId,
      },
      { is_active: false },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Acceso no encontrado');
    }
  }

  async getStudentAccess(studentId: number): Promise<CourseAccess[]> {
    return this.courseAccessRepository.find({
      where: { student_id: studentId, is_active: true },
      relations: ['course', 'course.professor'],
    });
  }

  async checkAccess(studentId: number, courseId: number): Promise<boolean> {
    const access = await this.courseAccessRepository.findOne({
      where: {
        student_id: studentId,
        course_id: courseId,
        is_active: true,
      },
    });
    return !!access;
  }

  // Company Access
  async createCompanyAccess(
    createCompanyAccessDto: CreateCompanyAccessDto,
  ): Promise<CompanyAccess> {
    const course = await this.courseRepository.findOne({
      where: { id: createCompanyAccessDto.course_id },
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    if (!course.is_shared_access) {
      throw new BadRequestException(
        'Este curso no permite acceso compartido para empresas',
      );
    }

    const companyAccess = this.companyAccessRepository.create(createCompanyAccessDto);
    return this.companyAccessRepository.save(companyAccess);
  }

  async assignCompanySeat(
    companyAccessId: number,
    studentId: number,
  ): Promise<CourseAccess> {
    const companyAccess = await this.companyAccessRepository.findOne({
      where: { id: companyAccessId },
    });

    if (!companyAccess) {
      throw new NotFoundException('Acceso de empresa no encontrado');
    }

    if (companyAccess.seats_used >= companyAccess.seats_purchased) {
      throw new BadRequestException('No hay asientos disponibles');
    }

    if (new Date() > companyAccess.valid_until) {
      throw new BadRequestException('El acceso de empresa ha expirado');
    }

    // Crear acceso para el estudiante
    const access = await this.grantAccess({
      student_id: studentId,
      course_id: companyAccess.course_id,
      access_type: AccessType.COMPANY_SEAT,
    });

    // Incrementar contador
    companyAccess.seats_used += 1;
    await this.companyAccessRepository.save(companyAccess);

    return access;
  }

  async findAllCompanyAccess(): Promise<CompanyAccess[]> {
    return this.companyAccessRepository.find({
      relations: ['course'],
    });
  }
}

