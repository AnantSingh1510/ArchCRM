import { IsString, IsOptional, IsNumber } from 'class-validator';

export class DiscountDto {
  @IsString()
  @IsOptional()
  inauguralDiscount?: string;

  @IsString()
  @IsOptional()
  rebate?: string;

  @IsString()
  @IsOptional()
  perSqFt?: string;

  @IsString()
  @IsOptional()
  percentage?: string;
}
