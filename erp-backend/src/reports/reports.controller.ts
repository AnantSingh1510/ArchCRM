import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('applicant-payment-file')
  findApplicantPaymentFile(@Query() filters: any) {
    return this.reportsService.findAll(filters);
  }

  @Get('unit-status')
  unitStatus(@Query() filters: any) {
    return this.reportsService.unitStatus(filters);
  }
}
