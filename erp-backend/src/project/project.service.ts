import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto) {
    const { clientIds, ...rest } = createProjectDto;
    return this.prisma.project.create({
      data: {
        ...rest,
        ...(clientIds && {
          clients: {
            create: clientIds.map((clientId) => ({
              client: {
                connect: {
                  id: clientId,
                },
              },
            })),
          },
        }),
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      include: {
        clients: {
          include: {
            client: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        clients: {
          include: {
            client: true,
          },
        },
        phases: true,
        members: true,
        properties: true,
      },
    });
  }

  update(id: string, updateProjectDto: UpdateProjectDto) {
    // The DTO is compatible, so we can pass it directly.
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
