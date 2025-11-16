import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';

@Injectable()
export class PaymentPlanService {
  constructor(private prisma: PrismaService) {}

  create(createPaymentPlanDto: CreatePaymentPlanDto) {
    const { projectId, ...rest } = createPaymentPlanDto;
    return this.prisma.paymentPlan.create({
      data: {
        ...rest,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.paymentPlan.findMany();
  }

  findOne(id: string) {
    return this.prisma.paymentPlan.findUnique({
      where: { id },
    });
  }

  update(id: string, updatePaymentPlanDto: UpdatePaymentPlanDto) {
    return this.prisma.paymentPlan.update({
      where: { id },
      data: updatePaymentPlanDto,
    });
  }

  remove(id: string) {
    return this.prisma.paymentPlan.delete({
      where: { id },
    });
  }
}
