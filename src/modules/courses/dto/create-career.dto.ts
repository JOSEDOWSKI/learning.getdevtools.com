import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { CareerStatus } from '../entities/career.entity';

export class CreateCareerDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  total_months: number;

  @IsOptional()
  @IsEnum(CareerStatus)
  status?: CareerStatus;
}

