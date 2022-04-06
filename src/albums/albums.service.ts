import { Injectable } from '@nestjs/common'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'
import { SpannerService } from '../infra/service/spanner.service'
import { Album } from './entities/album.entity'
import { Row } from '@google-cloud/spanner/build/src/partial-result-stream'
import { Rows } from '@google-cloud/spanner/build/src/transaction'
import { Json } from '@google-cloud/spanner/build/src/codec'

@Injectable()
export class AlbumsService {
  constructor(private readonly spanner: SpannerService) {}

  create(createAlbumDto: CreateAlbumDto) {
    return 'This action adds a new album'
  }

  async findAll(): Promise<Album[]> {
    const sql = 'SELECT * FROM Albums'
    const [rows]  = await this.spanner.getDb().run(sql)
    const albums: Album[] = rows.map<Album>((row) => {
      const rowJson: Json = row.toJSON()
      const album = new Album()
      album.albumId = rowJson.AlbumId
      album.singerId = rowJson.SingerId
      album.albumTitle = rowJson.AlbumTitle
      return album

    })
    return albums
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
