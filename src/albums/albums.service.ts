import { Injectable } from '@nestjs/common'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'
import { Album } from './entities/album.entity'
import { AlbumRepository } from './album.repository'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AlbumsService {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = new Album()
    album.albumId = uuidv4()
    album.albumTitle = 'albumTitle'
    album.singerId = '12'

    return await this.albumRepository.insert(album)
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.findAll()
  }

  async findOne(id: number): Promise<Album> {
    return await this.albumRepository.findOne({
      where: { singerId: '12', albumId: '1' },
    })
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto): Promise<number> {
    const album = new Album()
    album.albumId = '1'
    album.singerId = '13'
    album.albumTitle = 'updated album title'
    return await this.albumRepository.updateByPK(album)
  }

  async remove(): Promise<number> {
    return await this.albumRepository.deleteByPK({
      where: {
        singerId: '12',
        albumId: '1',
      },
    })
  }
}
