import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  create(createPropertyDto: CreatePropertyDto) {
    const { projectId, ...rest } = createPropertyDto;
    return this.prisma.property.create({
      data: {
        ...rest,
        project: {
          connect: { id: projectId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.property.findMany({
      include: {
        project: true,
      },
    });
  }

  async findAllByUserId(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const client = await this.prisma.client.findFirst({
      where: { user: { id: user.id } },
    });

    if (!client) {
      return [];
    }

    const bookings = await this.prisma.booking.findMany({
      where: { clientId: client.id },
      include: {
        property: {
          include: {
            project: true,
          },
        },
      },
    });

    return bookings.map((booking) => booking.property);
  }

  findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });
  }
}
