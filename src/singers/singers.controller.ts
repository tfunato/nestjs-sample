import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { SingersService } from './singers.service'
import { CreateSingerDto } from './dto/create-singer.dto'
import { UpdateSingerDto } from './dto/update-singer.dto'

@Controller('singers')
export class SingersController {
  constructor(private readonly singersService: SingersService) {}

  @Post()
  create(@Body() createSingerDto: CreateSingerDto) {
    return this.singersService.create(createSingerDto)
  }

  @Get()
  findAll() {
    return this.singersService.findAll()
  }

  @Get(':singerId')
  findOne(@Param('singerId') singerId: string) {
    return this.singersService.findOne(singerId)
  }

  @Patch(':singerId')
  update(@Param('singerId') singerId: string, @Body() updateSingerDto: UpdateSingerDto) {
    return this.singersService.update(singerId, updateSingerDto)
  }

  @Delete(':singerId')
  remove(@Param('singerId') singerId: string) {
    return this.singersService.remove(singerId)
  }
}
