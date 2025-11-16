import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class ApprovalService {
  constructor(
    private prisma: PrismaService,
    private invoiceService: InvoiceService,
  ) {}

  create(createApprovalDto: CreateApprovalDto, requesterId: string) {
    return this.prisma.approval.create({
      data: {
        ...createApprovalDto,
        requesterId,
      },
    });
  }

  findAll() {
    return this.prisma.approval.findMany({
      include: {
        requester: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.approval.findUnique({
      where: { id },
      include: {
        requester: true,
      },
    });
  }

  async update(id: string, updateApprovalDto: UpdateApprovalDto) {
    const approval = await this.prisma.approval.update({
      where: { id },
      data: updateApprovalDto,
    });

    if (approval.status === 'APPROVED' && approval.type === 'INVOICE') {
      const invoiceData = approval.data as any;
      await this.invoiceService.create({
        ...invoiceData,
        date: new Date(invoiceData.date),
        dueDate: new Date(invoiceData.dueDate),
      });
    }

    return approval;
  }

  remove(id: string) {
    return this.prisma.approval.delete({ where: { id } });
  }
}
