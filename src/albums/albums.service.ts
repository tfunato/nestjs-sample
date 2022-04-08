import { Injectable } from '@nestjs/common'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'
import { Album } from './entities/album.entity'
import { AlbumRepository } from './album.repository'
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumsService {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const album = new Album()
    album.albumId = uuidv4()
    album.albumTitle = 'albumTitle'
    album.singerId = '12'

    return await this.albumRepository.insert(album)
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.findAll()
  }

  async findOne(id: number) {
    return await this.albumRepository.findOne({
      where: {singerId: '12', albumId:'1'}
    })
  }

  update(id: number, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`
  }

  remove(id: number) {
    return `This action removes a #${id} album`
  }
}
