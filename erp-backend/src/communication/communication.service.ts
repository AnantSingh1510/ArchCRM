import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  async create(createCommunicationDto: CreateCommunicationDto) {
    return this.prisma.communication.create({
      data: {
        ...createCommunicationDto,
        date: new Date(),
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.communication.findUnique({
      where: { id },
    });
  }
}
