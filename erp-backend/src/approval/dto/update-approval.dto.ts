import { IsEnum, IsOptional } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';

export class UpdateApprovalDto {
  @IsEnum(ApprovalStatus)
  @IsOptional()
  status?: ApprovalStatus;
}
