import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SingersService } from './singers.service';
import { CreateSingerDto } from './dto/create-singer.dto';
import { UpdateSingerDto } from './dto/update-singer.dto';

@Controller('singers')
export class SingersController {
  constructor(private readonly singersService: SingersService) {}

  @Post()
  create(@Body() createSingerDto: CreateSingerDto) {
    return this.singersService.create(createSingerDto);
  }

  @Get()
  findAll() {
    return this.singersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.singersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSingerDto: UpdateSingerDto) {
    return this.singersService.update(+id, updateSingerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.singersService.remove(+id);
  }
}
