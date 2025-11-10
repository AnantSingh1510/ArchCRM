import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    const { clientId, ...rest } = createInvoiceDto;
    return this.prisma.invoice.create({
      data: {
        ...rest,
        client: {
          connect: { id: clientId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.invoice.findMany({
      include: {
        client: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const { clientId, ...rest } = updateInvoiceDto;
    const data: any = { ...rest };
    if (clientId) {
      data.client = {
        connect: { id: clientId },
      };
    }
    return this.prisma.invoice.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.invoice.delete({ where: { id } });
  }
}
