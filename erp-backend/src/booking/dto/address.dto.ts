import { IsString, IsOptional } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  pinCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  mobile1?: string;

  @IsString()
  @IsOptional()
  mobile2?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  std?: string;
}
