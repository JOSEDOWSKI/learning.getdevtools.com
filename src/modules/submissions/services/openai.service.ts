import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Submission } from '../entities/submission.entity';
import { Course } from '../../courses/entities/course.entity';
import { EvaluationResult } from '../interfaces/ai-provider.interface';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;
  private modelVersion = 'gpt-4o';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async evaluateSubmission(
    submission: Submission,
    course: Course,
  ): Promise<EvaluationResult> {
    if (!this.openai) {
      // Fallback si no hay API key configurada
      return this.getMockEvaluation();
    }

    try {
      const prompt = this.buildEvaluationPrompt(submission, course);

      const response = await this.openai.chat.completions.create({
        model: this.modelVersion,
        messages: [
          {
            role: 'system',
            content:
              'Eres un evaluador experto de proyectos técnicos. Evalúa según la rúbrica proporcionada y devuelve un JSON con la calificación (0-20), feedback resumido y desglose por criterios.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const evaluation = JSON.parse(content);

      return {
        score: this.normalizeScore(evaluation.score || evaluation.calificacion || 15),
        feedback_summary:
          evaluation.feedback_summary ||
          evaluation.feedback ||
          'Evaluación completada',
        rubric_breakdown:
          evaluation.rubric_breakdown ||
          evaluation.criterios ||
          evaluation,
        model_version: this.modelVersion,
        provider: 'openai',
      };
    } catch (error) {
      console.error('Error en evaluación de IA:', error);
      return this.getMockEvaluation();
    }
  }

  private buildEvaluationPrompt(submission: Submission, course: Course): string {
    const rubric = course.rubric || 'Rúbrica estándar: Funcionalidad (40%), Código (30%), Documentación (20%), Creatividad (10%)';

    return `
Evalúa el siguiente proyecto de estudiante:

Curso: ${course.title}
Proyecto: ${submission.project_url}
Estudiante: ${submission.student.full_name}

Rúbrica del curso:
${rubric}

Instrucciones:
1. Revisa el proyecto en la URL proporcionada
2. Evalúa según la rúbrica
3. Asigna una calificación de 0-20
4. Proporciona feedback constructivo
5. Desglosa la evaluación por cada criterio de la rúbrica

Devuelve un JSON con el siguiente formato:
{
  "score": <número 0-20>,
  "feedback_summary": "<resumen del feedback>",
  "rubric_breakdown": {
    "criterio1": { "score": <0-100>, "comments": "<comentarios>" },
    "criterio2": { "score": <0-100>, "comments": "<comentarios>" }
  }
}
`;
  }

  private normalizeScore(score: any): number {
    const numScore = typeof score === 'number' ? score : parseFloat(score) || 15;
    if (numScore > 20) return 20;
    if (numScore < 0) return 0;
    return Math.round(numScore * 10) / 10;
  }

  private getMockEvaluation(): EvaluationResult {
    return {
      score: 15.0,
      feedback_summary:
        'Evaluación pendiente. Configura OPENAI_API_KEY para evaluación automática.',
      rubric_breakdown: {
        funcionalidad: { score: 75, comments: 'Pendiente de revisión' },
        codigo: { score: 75, comments: 'Pendiente de revisión' },
      },
      model_version: 'mock',
      provider: 'mock',
    };
  }
}

