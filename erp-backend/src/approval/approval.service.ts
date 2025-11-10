import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Injectable()
export class ApprovalService {
  constructor(private prisma: PrismaService) {}

  create(createApprovalDto: CreateApprovalDto) {
    return this.prisma.approval.create({ data: createApprovalDto });
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

  update(id: string, updateApprovalDto: UpdateApprovalDto) {
    return this.prisma.approval.update({
      where: { id },
      data: updateApprovalDto,
    });
  }

  remove(id: string) {
    return this.prisma.approval.delete({ where: { id } });
  }
}
