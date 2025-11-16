import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const payment = await this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        date: new Date(),
        status: 'COMPLETED',
      },
    });

    await this.prisma.invoice.update({
      where: { id: createPaymentDto.invoiceId },
      data: { status: 'PAID' },
    });

    return payment;
  }

  findAll() {
    return this.prisma.payment.findMany();
  }
}
