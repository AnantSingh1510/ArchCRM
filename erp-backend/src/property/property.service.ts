import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  create(createPropertyDto: CreatePropertyDto) {
    const { clientId, projectId, ...rest } = createPropertyDto;
    return this.prisma.property.create({
      data: {
        ...rest,
        project: {
          connect: { id: projectId },
        },
        client: {
          connect: { id: clientId },
        },
      },
    });
  }
}
