import { Injectable } from '@nestjs/common'
import { CreateSingerDto } from './dto/create-singer.dto'
import { UpdateSingerDto } from './dto/update-singer.dto'
import { Singer } from './entities/singer.entity'
import { v4 as uuidv4 } from 'uuid'
import { SingersRepository } from './singers.repository'

@Injectable()
export class SingersService {
  constructor(private readonly singerRepository: SingersRepository) {}

  async create(createSingerDto: CreateSingerDto):Promise<Singer> {
    const singer = new Singer()
    singer.singerId = uuidv4()
    singer.lastName = 'singer last name'
    singer.firstName = 'singer first name'
    return await this.singerRepository.insert(singer)
  }

  async findAll(): Promise<Singer[]> {
    return await this.singerRepository.findAll()
  }

  async findOne(singerId: string): Promise<Singer> | null {
    return await this.singerRepository.findOne({
      where: {singerId: singerId}
      }
    )
  }

  async update(singerId: string, updateSingerDto: UpdateSingerDto): Promise<number> {
    const singer = new Singer()
    singer.singerId = singerId
    singer.lastName = 'last name update'
    singer.firstName = 'first name update'
    return await this.singerRepository.updateByPK(singer)
  }

  async remove(singerId: string): Promise<number> {
    return await this.singerRepository.deleteByPK({
      where: {singerId: singerId}
    })
  }
}
