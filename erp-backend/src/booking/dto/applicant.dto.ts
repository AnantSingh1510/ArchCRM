import { IsString, IsOptional, IsDate, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ApplicantDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  relationName?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dob?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  anniversaryDate?: Date;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsNumber()
  @IsOptional()
  children?: number;

  @IsString()
  @IsOptional()
  passportNo?: string;

  @IsString()
  @IsOptional()
  panNumber?: string;

  @IsString()
  @IsOptional()
  aadhaarNumber?: string;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @IsString()
  @IsOptional()
  ifscCode?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  bankBranch?: string;
}
