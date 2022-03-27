import { Injectable } from '@nestjs/common';
import { CreateSingerDto } from './dto/create-singer.dto';
import { UpdateSingerDto } from './dto/update-singer.dto';

@Injectable()
export class SingersService {
  create(createSingerDto: CreateSingerDto) {
    return 'This action adds a new singer';
  }

  findAll() {
    return `This action returns all singers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} singer`;
  }

  update(id: number, updateSingerDto: UpdateSingerDto) {
    return `This action updates a #${id} singer`;
  }

  remove(id: number) {
    return `This action removes a #${id} singer`;
  }
}
