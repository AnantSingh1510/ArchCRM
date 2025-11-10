export class CreateTaskDto {
  name: string;
  description?: string;
  dueDate: Date;
  phaseId: string;
  assigneeId?: string;
}
