export class CreateClientDto {
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  joinedDate?: Date;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  gstNumber?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  status: string;
  kycStatus: string;
}
