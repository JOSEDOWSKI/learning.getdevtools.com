import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateCareerDto } from './create-career.dto';
import { CareerStatus } from '../entities/career.entity';

export class UpdateCareerDto extends PartialType(CreateCareerDto) {
  @IsOptional()
  @IsEnum(CareerStatus)
  status?: CareerStatus;
}

