export class CreateDocumentDto {
  name: string;
  type: string;
  status: string;
  tags: string[];
  uploadedDate: Date;
  uploadedById: string;
  expiryDate?: Date;
  size: string;
  clientId: string;
  url: string;
}
