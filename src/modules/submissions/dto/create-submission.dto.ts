import { IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateSubmissionDto {
  @IsNumber()
  course_id: number;

  @IsString()
  @IsUrl()
  project_url: string;
}

