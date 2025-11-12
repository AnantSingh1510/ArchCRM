import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  create(createDocumentDto: CreateDocumentDto) {
    const { clientId, tags, ...rest } = createDocumentDto;
    return this.prisma.document.create({
      data: {
        ...rest,
        tags: {
          set: tags,
        },
        client: {
          connect: { id: clientId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.document.findMany({
      include: {
        client: true,
      },
    });
  }

  findAllByClientId(clientId: string) {
    return this.prisma.document.findMany({
      where: { clientId },
      include: {
        client: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });
  }

  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const { clientId, ...rest } = updateDocumentDto;
    const data: any = { ...rest };
    if (clientId) {
      data.client = {
        connect: { id: clientId },
      };
    }
    return this.prisma.document.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.document.delete({ where: { id } });
  }
}
