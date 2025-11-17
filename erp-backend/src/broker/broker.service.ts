import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';

@Injectable()
export class BrokerService {
  constructor(private prisma: PrismaService) {}

  create(createBrokerDto: CreateBrokerDto) {
    return this.prisma.broker.create({
      data: createBrokerDto,
    });
  }

  findAll() {
    return this.prisma.broker.findMany();
  }

  findOne(id: string) {
    return this.prisma.broker.findUnique({
      where: { id },
    });
  }

  update(id: string, updateBrokerDto: UpdateBrokerDto) {
    return this.prisma.broker.update({
      where: { id },
      data: updateBrokerDto,
    });
  }

  remove(id: string) {
    return this.prisma.broker.delete({
      where: { id },
    });
  }
}
