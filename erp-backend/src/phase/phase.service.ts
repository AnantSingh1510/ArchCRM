import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';

@Injectable()
export class PhaseService {
  constructor(private prisma: PrismaService) {}

  create(createPhaseDto: CreatePhaseDto) {
    return this.prisma.phase.create({ data: createPhaseDto });
  }

  findAll() {
    return this.prisma.phase.findMany();
  }

  findOne(id: string) {
    return this.prisma.phase.findUnique({ where: { id } });
  }

  update(id: string, updatePhaseDto: UpdatePhaseDto) {
    return this.prisma.phase.update({ where: { id }, data: updatePhaseDto });
  }

  remove(id: string) {
    return this.prisma.phase.delete({ where: { id } });
  }
}
