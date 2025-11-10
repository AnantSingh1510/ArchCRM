import { IsString, IsObject } from 'class-validator';

export class CreateApprovalDto {
  @IsString()
  type: string;

  @IsString()
  requesterId: string;

  @IsObject()
  data: any;
}
