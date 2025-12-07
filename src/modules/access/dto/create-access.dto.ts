import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { AccessType } from '../entities/course-access.entity';

export class CreateAccessDto {
  @IsNumber()
  student_id: number;

  @IsNumber()
  course_id: number;

  @IsOptional()
  @IsEnum(AccessType)
  access_type?: AccessType;

  @IsOptional()
  @IsNumber()
  transaction_id?: number;
}

