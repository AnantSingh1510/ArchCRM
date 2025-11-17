import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.applicantPaymentFile.findMany({
      include: {
        booking: {
          include: {
            project: true,
            client: true,
            property: true,
            broker: true,
            salesEmployee: true,
            paymentPlan: true,
          },
        },
      },
    });
  }
}
