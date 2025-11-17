import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum PlanType {
  CONSTRUCTION = 'Construction Plan',
  DOWN_PAYMENT = 'Down Payment Plan',
  FLEXI = 'Flexi Plan',
  TIME = 'Time Plan',
  EMI = 'Emi Plan',
}

enum EmiCycle {
    MONTHLY = 'Monthly',
    QUARTERLY = 'Quarterly',
    HALF_YEARLY = 'Half-Yearly',
    ANNUALLY = 'Annually',
}

enum DiscountCalculate {
    FIX = 'Fix',
    ADD_DISCOUNT = 'Add Discount(%)',
}

enum PaymentType {
    PERCENT = '%',
    FIX = 'Fix',
}

export class CreatePaymentPlanDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  planName: string;

  @IsEnum(PlanType)
  @IsNotEmpty()
  planType: PlanType;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  roi?: number;

  @IsEnum(EmiCycle)
  @IsOptional()
  emiCycle?: EmiCycle;

  @IsEnum(PaymentType)
  @IsNotEmpty()
  type: PaymentType;

  @Type(() => (value) => value === 'true' || value === true)
  timelyDiscount: boolean;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discountPerArea?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discountPercentage?: number;

  @IsEnum(DiscountCalculate)
  @IsOptional()
  discountCalculate?: DiscountCalculate;

  @IsString()
  @IsOptional()
  description?: string;
}
