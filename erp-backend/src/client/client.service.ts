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
    const { properties, ...data } = updateClientDto;
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  findAll() {
    return this.prisma.client.findMany({
      include: {
        projects: true,
        properties: {
          include: {
            project: true,
          },
        },
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
