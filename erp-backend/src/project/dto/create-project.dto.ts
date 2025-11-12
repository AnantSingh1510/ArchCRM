export class CreateProjectDto {
  name: string;
  clientIds?: string[];
  location: string;
  startDate?: Date;
  endDate?: Date;
  photos?: string[];
}
