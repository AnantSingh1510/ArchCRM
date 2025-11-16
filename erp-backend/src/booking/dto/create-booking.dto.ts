import { IsString, IsNotEmpty, IsOptional, IsDate, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { UnitHolderType, CustomerClassification, BookingType, BookingStatus, PropertyType } from '@prisma/client';

export class CreateBookingDto {
  @IsEnum(UnitHolderType)
  @IsNotEmpty()
  unitHolderType: UnitHolderType;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsEnum(PropertyType)
  @IsNotEmpty()
  unitType: PropertyType;

  @IsEnum(CustomerClassification)
  @IsNotEmpty()
  customerClassification: CustomerClassification;

  @IsString()
  @IsOptional()
  brokerId?: string;

  @IsEnum(BookingType)
  @IsNotEmpty()
  bookingType: BookingType;

  @IsString()
  @IsNotEmpty()
  paymentPlan: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  applicationDate: Date;

  @IsNumber()
  @IsNotEmpty()
  basicPrice: number;

  @IsString()
  @IsOptional()
  formNo?: string;

  @IsString()
  @IsOptional()
  registrationNo?: string;

  @IsString()
  @IsOptional()
  gstin?: string;

  @IsOptional()
  companyDiscount?: any;

  @IsOptional()
  brokerDiscount?: any;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  salesEmployeeId: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsOptional()
  otherCosts?: any;

  @IsOptional()
  finance?: any;

  @IsOptional()
  nomineeDetails?: any;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
