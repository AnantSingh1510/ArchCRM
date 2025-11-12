import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('property')
@UseGuards(AuthGuard('jwt'))
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create(createPropertyDto);
  }

  @Get('user/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.propertyService.findAllByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }
}
