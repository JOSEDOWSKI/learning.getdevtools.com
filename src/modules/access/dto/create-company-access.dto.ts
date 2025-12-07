import { IsString, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateCompanyAccessDto {
  @IsString()
  company_name: string;

  @IsNumber()
  course_id: number;

  @IsNumber()
  @Min(1)
  seats_purchased: number;

  @IsDateString()
  valid_until: string;
}

