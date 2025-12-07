import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateCourseDto {
  @IsNumber()
  professor_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  base_price?: number;

  @IsOptional()
  @IsNumber()
  revenue_share_pct?: number;

  @IsOptional()
  @IsBoolean()
  is_shared_access?: boolean;

  @IsNumber()
  credits: number;

  @IsOptional()
  @IsString()
  rubric?: string;
}

