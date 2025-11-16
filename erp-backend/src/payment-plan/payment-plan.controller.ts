import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentPlanService } from './payment-plan.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';

@Controller('payment-plan')
export class PaymentPlanController {
  constructor(private readonly paymentPlanService: PaymentPlanService) {}

  @Post()
  create(@Body() createPaymentPlanDto: CreatePaymentPlanDto) {
    return this.paymentPlanService.create(createPaymentPlanDto);
  }

  @Get()
  findAll() {
    return this.paymentPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentPlanService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentPlanDto: UpdatePaymentPlanDto) {
    return this.paymentPlanService.update(id, updatePaymentPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentPlanService.remove(id);
  }
}
