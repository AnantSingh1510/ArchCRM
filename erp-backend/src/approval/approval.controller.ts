import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Controller('approval')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Post()
  create(@Body() createApprovalDto: CreateApprovalDto) {
    return this.approvalService.create(createApprovalDto);
  }

  @Get()
  findAll() {
    return this.approvalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.approvalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApprovalDto: UpdateApprovalDto) {
    return this.approvalService.update(id, updateApprovalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.approvalService.remove(id);
  }
}
