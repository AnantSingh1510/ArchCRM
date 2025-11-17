import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateBrokerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
