import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIService } from './openai.service';
import { GeminiService } from './gemini.service';
import { IAiProvider, EvaluationResult } from '../interfaces/ai-provider.interface';
import { Submission } from '../entities/submission.entity';
import { Course } from '../../courses/entities/course.entity';

@Injectable()
export class AiProviderFactory implements IAiProvider {
  private provider: IAiProvider;

  constructor(
    private configService: ConfigService,
    private openAIService: OpenAIService,
    private geminiService: GeminiService,
  ) {
    this.initializeProvider();
  }

  private initializeProvider() {
    const providerType = this.configService.get<string>(
      'AI_PROVIDER',
      'gemini',
    ).toLowerCase();

    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');

    // Prioridad: 1. Configuración explícita, 2. Disponibilidad de API keys
    if (providerType === 'gemini' && geminiKey) {
      this.provider = this.geminiService;
    } else if (providerType === 'openai' && openaiKey) {
      this.provider = this.openAIService;
    } else if (geminiKey) {
      // Fallback a Gemini si está disponible
      this.provider = this.geminiService;
    } else if (openaiKey) {
      // Fallback a OpenAI si está disponible
      this.provider = this.openAIService;
    } else {
      // Mock provider si no hay ninguna API key
      this.provider = {
        evaluateSubmission: async () => ({
          score: 15.0,
          feedback_summary:
            'Evaluación pendiente. Configura GEMINI_API_KEY o OPENAI_API_KEY para evaluación automática.',
          rubric_breakdown: {
            funcionalidad: { score: 75, comments: 'Pendiente de revisión' },
            codigo: { score: 75, comments: 'Pendiente de revisión' },
          },
          model_version: 'mock',
          provider: 'mock',
        }),
      };
    }
  }

  async evaluateSubmission(
    submission: Submission,
    course: Course,
  ): Promise<EvaluationResult> {
    return this.provider.evaluateSubmission(submission, course);
  }

  getCurrentProvider(): string {
    if (this.provider === this.geminiService) return 'gemini';
    if (this.provider === this.openAIService) return 'openai';
    return 'mock';
  }
}

