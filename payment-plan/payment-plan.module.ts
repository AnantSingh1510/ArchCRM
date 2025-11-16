import { Module } from '@nestjs/common';
import { PaymentPlanService } from './payment-plan.service';
import { PaymentPlanController } from './payment-plan.controller';

@Module({
  providers: [PaymentPlanService],
  controllers: [PaymentPlanController]
})
export class PaymentPlanModule {}
