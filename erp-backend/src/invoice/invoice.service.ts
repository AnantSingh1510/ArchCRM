import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: createInvoiceDto,
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
    return this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto,
    });
  }

  remove(id: string) {
    return this.prisma.invoice.delete({ where: { id } });
  }

  findAllByClientId(clientId: string) {
    return this.prisma.invoice.findMany({
      where: { clientId },
      include: {
        client: true,
      },
    });
  }
}
