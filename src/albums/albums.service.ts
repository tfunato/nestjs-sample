import { Injectable } from '@nestjs/common'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'
import { SpannerService } from '../infra/service/spanner.service'

@Injectable()
export class AlbumsService {
  constructor(private readonly spanner: SpannerService) {}

  create(createAlbumDto: CreateAlbumDto) {
    return 'This action adds a new album'
  }

  async findAll() {
    const sql = 'SELECT * FROM Albums'
    const [rows] = await this.spanner.getDb().run(sql)
    return rows
  }

  findOne(id: number) {
    return `This action returns a #${id} album`
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`
  }

  remove(id: number) {
    return `This action removes a #${id} album`
  }
}
