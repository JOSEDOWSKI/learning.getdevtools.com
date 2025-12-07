import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { AiEvaluation } from './entities/ai-evaluation.entity';
import { Course } from '../courses/entities/course.entity';
import { CourseAccess } from '../access/entities/course-access.entity';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { AiProviderFactory } from './services/ai-provider.factory';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
    @InjectRepository(AiEvaluation)
    private evaluationRepository: Repository<AiEvaluation>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(CourseAccess)
    private courseAccessRepository: Repository<CourseAccess>,
    private aiProvider: AiProviderFactory,
  ) {}

  async create(
    studentId: number,
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<Submission> {
    // Verificar que el curso existe
    const course = await this.courseRepository.findOne({
      where: { id: createSubmissionDto.course_id },
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    // Verificar acceso (simplificado - sin pagos)
    const courseAccess = await this.courseAccessRepository.findOne({
      where: {
        student_id: studentId,
        course_id: createSubmissionDto.course_id,
        is_active: true,
      },
    });

    if (!courseAccess) {
      throw new BadRequestException('No tienes acceso a este curso');
    }

    const submission = this.submissionRepository.create({
      student_id: studentId,
      course_id: createSubmissionDto.course_id,
      project_url: createSubmissionDto.project_url,
    });

    const savedSubmission = await this.submissionRepository.save(submission);

    // Procesar evaluación en segundo plano (simulado)
    this.processEvaluation(savedSubmission.id, course).catch((error) => {
      console.error('Error procesando evaluación:', error);
    });

    return savedSubmission;
  }

  async findAll(studentId?: number): Promise<Submission[]> {
    const where = studentId ? { student_id: studentId } : {};
    return this.submissionRepository.find({
      where,
      relations: ['student', 'course', 'evaluation'],
      order: { submitted_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({
      where: { id },
      relations: ['student', 'course', 'evaluation'],
    });
    if (!submission) {
      throw new NotFoundException(`Submission con ID ${id} no encontrada`);
    }
    return submission;
  }

  async getEvaluation(submissionId: number): Promise<AiEvaluation> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { submission_id: submissionId },
      relations: ['submission'],
    });
    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }
    return evaluation;
  }

  private async processEvaluation(
    submissionId: number,
    course: Course,
  ): Promise<void> {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['student', 'course'],
    });

    if (!submission) {
      throw new NotFoundException('Submission no encontrada');
    }

    // Evaluar con IA (usa el proveedor configurado: Gemini o OpenAI)
    const evaluationResult = await this.aiProvider.evaluateSubmission(
      submission,
      course,
    );

    // Guardar evaluación
    const evaluation = this.evaluationRepository.create({
      submission_id: submissionId,
      score: evaluationResult.score,
      feedback_summary: evaluationResult.feedback_summary,
      rubric_breakdown: evaluationResult.rubric_breakdown,
      ai_model_version: evaluationResult.model_version,
    });

    await this.evaluationRepository.save(evaluation);
  }
}

