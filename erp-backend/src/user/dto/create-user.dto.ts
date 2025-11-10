export class CreateUserDto {
  username: string;
  email: string;
  name?: string;
  phone?: string;
  password: string;
  role: string;
}
