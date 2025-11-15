import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards, Res } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() createDocumentDto: CreateDocumentDto, @Req() req) {
    const tags = createDocumentDto.tags ? (createDocumentDto.tags as any).split(',').map(tag => tag.trim()) : [];
    const clientId = req.user.role === 'USER' ? req.user.clientId : createDocumentDto.clientId;
    console.log('client:', req.user);
    console.log('Uploading file for clientId:', clientId);
    return this.documentService.create({
      ...createDocumentDto,
      name: createDocumentDto.name,
      type: createDocumentDto.type,
      clientId,
      tags,
      size: file.size.toString(),
      url: file.path,
      status: 'pending',
      uploadedDate: new Date(),
      uploadedBy: req.user.username,
    } as any);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.documentService.findAll();
  }

  @Get('client/:clientId')
  @UseGuards(AuthGuard('jwt'))
  findAllByClientId(@Param('clientId') clientId: string) {
    return this.documentService.findAllByClientId(clientId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }

  @Get('download/:filename')
  downloadFile(@Param('filename') filename: string, @Res() res) {
    return res.sendFile(filename, { root: './uploads' });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }
}
