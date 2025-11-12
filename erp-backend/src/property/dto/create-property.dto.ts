export class CreatePropertyDto {
  plotNumber: string;
  dimensions: string;
  location: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND';
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED';
  projectId: string;
  clientId: string;
}
