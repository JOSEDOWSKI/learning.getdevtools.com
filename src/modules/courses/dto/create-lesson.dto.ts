import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateLessonDto {
  @IsNumber()
  course_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order_index?: number;
}

