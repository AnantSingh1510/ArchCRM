import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import { PlanType, EmiCycle, PaymentType, DiscountCalculate } from '@prisma/client';

@Injectable()
export class PaymentPlanService {
  constructor(private prisma: PrismaService) {}

  create(createPaymentPlanDto: CreatePaymentPlanDto, attachmentUrl?: string) {
    const { projectId, ...planData } = createPaymentPlanDto;

    const planTypeMap: { [key: string]: PlanType } = {
      'Construction Plan': PlanType.CONSTRUCTION,
      'Down Payment Plan': PlanType.DOWN_PAYMENT,
      'Flexi Plan': PlanType.FLEXI,
      'Time Plan': PlanType.TIME,
      'Emi Plan': PlanType.EMI,
    };

    const emiCycleMap: { [key: string]: EmiCycle } = {
        'Monthly': EmiCycle.MONTHLY,
        'Quarterly': EmiCycle.QUARTERLY,
        'Half-Yearly': EmiCycle.HALF_YEARLY,
        'Annually': EmiCycle.ANNUALLY,
    };

    const paymentTypeMap: { [key: string]: PaymentType } = {
        '%': PaymentType.PERCENT,
        'Fix': PaymentType.FIX,
    };

    const discountCalculateMap: { [key: string]: DiscountCalculate } = {
        'Fix': DiscountCalculate.FIX,
        'Add Discount(%)': DiscountCalculate.ADD_DISCOUNT,
    };

    const data: any = {
      ...planData,
      planType: planTypeMap[planData.planType],
      type: paymentTypeMap[planData.type],
      attachmentUrl,
      project: {
        connect: { id: projectId },
      },
    };

    if (planData.emiCycle) {
        data.emiCycle = emiCycleMap[planData.emiCycle];
    }
    if (planData.discountCalculate) {
        data.discountCalculate = discountCalculateMap[planData.discountCalculate];
    }

    return this.prisma.paymentPlan.create({ data });
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
    const { projectId, ...planData } = updatePaymentPlanDto;
    const data: any = { ...planData };
    if (projectId) {
      data.project = { connect: { id: projectId } };
    }
    return this.prisma.paymentPlan.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.paymentPlan.delete({
      where: { id },
    });
  }
}
