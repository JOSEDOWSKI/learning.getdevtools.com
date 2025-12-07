export interface EvaluationResult {
  score: number;
  feedback_summary: string;
  rubric_breakdown: any;
  model_version: string;
  provider: 'openai' | 'gemini' | 'mock';
}

export interface IAiProvider {
  evaluateSubmission(
    submission: any,
    course: any,
  ): Promise<EvaluationResult>;
}

