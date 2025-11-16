import { IsString, IsNotEmpty, IsOptional, IsDate, IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UnitHolderType, CustomerClassification, BookingType, BookingStatus, PropertyType } from '@prisma/client';
import { ApplicantDto } from './applicant.dto';
import { AddressDto } from './address.dto';
import { DiscountDto } from './discount.dto';

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
  paymentPlanId: string;

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
  @ValidateNested()
  @Type(() => DiscountDto)
  companyDiscount?: DiscountDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DiscountDto)
  brokerDiscount?: DiscountDto;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ApplicantDto)
  applicantDetails?: ApplicantDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  presentAddress?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  officeAddress?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  permanentAddress?: AddressDto;

  @IsString()
  @IsOptional()
  mailingAddress?: string;

  @IsString()
  @IsOptional()
  communicationPreference?: string;

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
