import { IsString, IsNotEmpty, IsJSON } from 'class-validator';

export class CreatePaymentPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsJSON()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}
