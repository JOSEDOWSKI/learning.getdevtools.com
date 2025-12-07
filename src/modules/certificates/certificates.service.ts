import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { CourseAccess } from '../access/entities/course-access.entity';
import { Career } from '../courses/entities/career.entity';
import { CareerCurriculum } from '../courses/entities/career-curriculum.entity';
import { AiEvaluation } from '../submissions/entities/ai-evaluation.entity';
import { Submission } from '../submissions/entities/submission.entity';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
    @InjectRepository(CourseAccess)
    private courseAccessRepository: Repository<CourseAccess>,
    @InjectRepository(Career)
    private careerRepository: Repository<Career>,
    @InjectRepository(CareerCurriculum)
    private curriculumRepository: Repository<CareerCurriculum>,
    @InjectRepository(AiEvaluation)
    private evaluationRepository: Repository<AiEvaluation>,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  async generateCourseCertificate(
    userId: number,
    courseId: number,
  ): Promise<Certificate> {
    // Verificar que el usuario completó el curso (tiene evaluación aprobada)
    const submission = await this.submissionRepository.findOne({
      where: {
        student_id: userId,
        course_id: courseId,
      },
      relations: ['evaluation'],
    });

    if (!submission || !submission.evaluation) {
      throw new BadRequestException(
        'Debes completar y aprobar el curso para obtener el certificado',
      );
    }

    if (submission.evaluation.score < 11) {
      throw new BadRequestException(
        'Debes obtener una calificación mínima de 11 para obtener el certificado',
      );
    }

    // Verificar si ya existe un certificado
    const existing = await this.certificateRepository.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (existing) {
      return existing;
    }

    const hash = this.generateHash(userId, courseId, null);
    const certificate = this.certificateRepository.create({
      user_id: userId,
      course_id: courseId,
      hash_digital_signature: hash,
      is_national_title: false,
    });

    return this.certificateRepository.save(certificate);
  }

  async generateNationalTitle(userId: number, careerId: number): Promise<Certificate> {
    const career = await this.careerRepository.findOne({
      where: { id: careerId },
      relations: ['curriculum', 'curriculum.course'],
    });

    if (!career) {
      throw new NotFoundException('Carrera no encontrada');
    }

    // Verificar que el usuario completó todos los cursos de la carrera
    const curriculum = await this.curriculumRepository.find({
      where: { career_id: careerId },
      order: { order_index: 'ASC' },
    });

    if (curriculum.length !== career.total_months) {
      throw new BadRequestException(
        'La carrera no tiene el número correcto de cursos configurados',
      );
    }

    // Verificar que completó todos los cursos con aprobación
    for (const item of curriculum) {
      const submission = await this.submissionRepository.findOne({
        where: {
          student_id: userId,
          course_id: item.course_id,
        },
        relations: ['evaluation'],
      });

      if (!submission || !submission.evaluation) {
        throw new BadRequestException(
          `Debes completar el curso del mes ${item.order_index} para obtener el título`,
        );
      }

      if (submission.evaluation.score < 11) {
        throw new BadRequestException(
          `Debes aprobar el curso del mes ${item.order_index} (calificación mínima: 11)`,
        );
      }
    }

    // Verificar si ya existe un título
    const existing = await this.certificateRepository.findOne({
      where: { user_id: userId, career_id: careerId, is_national_title: true },
    });

    if (existing) {
      return existing;
    }

    const hash = this.generateHash(userId, null, careerId);
    const certificate = this.certificateRepository.create({
      user_id: userId,
      career_id: careerId,
      hash_digital_signature: hash,
      is_national_title: true,
    });

    return this.certificateRepository.save(certificate);
  }

  async findAll(userId?: number): Promise<Certificate[]> {
    const where = userId ? { user_id: userId } : {};
    return this.certificateRepository.find({
      where,
      relations: ['user', 'course', 'career'],
      order: { issue_date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { id },
      relations: ['user', 'course', 'career'],
    });
    if (!certificate) {
      throw new NotFoundException(`Certificado con ID ${id} no encontrado`);
    }
    return certificate;
  }

  async verify(hash: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { hash_digital_signature: hash },
      relations: ['user', 'course', 'career'],
    });
    if (!certificate) {
      throw new NotFoundException('Certificado no válido');
    }
    return certificate;
  }

  private generateHash(userId: number, courseId: number | null, careerId: number | null): string {
    const data = `${userId}-${courseId || ''}-${careerId || ''}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

