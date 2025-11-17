import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ClientService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = await this.prisma.client.create({ data: createClientDto });
    await this.userService.create({
      username: client.email,
      email: client.email,
      name: client.name,
      password: 'password', // a default password
      role: 'USER',
      clientId: client.id,
    });
    return client;
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
      },
    });
  }

  remove(id: string) {
    return this.prisma.client.delete({ where: { id } });
  }

  async getDashboardData(id: string) {
    const clientData = await this.prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
        payments: {
          include: {
            invoice: true,
          },
        },
        communications: true,
        invoices: {
          where: {
            status: 'PENDING',
            dueDate: {
              gte: new Date(),
            },
          },
          orderBy: {
            dueDate: 'asc',
          },
          take: 1,
        },
      },
    });

    return clientData;
  }
}
