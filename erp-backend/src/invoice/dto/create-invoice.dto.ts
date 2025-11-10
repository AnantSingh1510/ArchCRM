export class CreateInvoiceDto {
  clientId: string;
  amount: number;
  date: Date;
  dueDate: Date;
  description?: string;
}
