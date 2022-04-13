import { Injectable } from '@nestjs/common'
import { Repository } from '../infra/repository/repository'
import { Album } from './entities/album.entity'

@Injectable()
export class AlbumRepository extends Repository<Album> {}
