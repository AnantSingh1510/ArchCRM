import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post()
  create(@Body() createCommunicationDto: CreateCommunicationDto) {
    return this.communicationService.create(createCommunicationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communicationService.findOne(id);
  }
}
