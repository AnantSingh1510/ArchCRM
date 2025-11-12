import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  create(createClientDto: CreateClientDto) {
    return this.prisma.client.create({ data: createClientDto });
  }

  update(id: string, updateClientDto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  findAll() {
    return this.prisma.client.findMany({
      include: {
        projects: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        projects: true,
        documents: true,
        properties: {
          include: {
            project: true,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}
