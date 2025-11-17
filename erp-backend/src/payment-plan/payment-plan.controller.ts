import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PaymentPlanService } from './payment-plan.service';
import { CreatePaymentPlanDto } from './dto/create-payment-plan.dto';
import { UpdatePaymentPlanDto } from './dto/update-payment-plan.dto';
import { extname } from 'path';

@Controller('payment-plans')
export class PaymentPlanController {
  constructor(private readonly paymentPlanService: PaymentPlanService) {}

  @Post()
  @UseInterceptors(FileInterceptor('attachment', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPaymentPlanDto: CreatePaymentPlanDto
  ) {
    const attachmentUrl = file ? `/uploads/${file.filename}` : undefined;
    return this.paymentPlanService.create(createPaymentPlanDto, attachmentUrl);
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
