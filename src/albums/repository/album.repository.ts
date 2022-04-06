import { Injectable } from '@nestjs/common'
import { SpannerService } from '../../infra/service/spanner.service'
import { Repository } from '../../infra/repository/repository'
import { Album } from '../entities/album.entity'

@Injectable()
export class AlbumRepository extends Repository<Album> {}
