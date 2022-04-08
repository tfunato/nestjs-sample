import { Module } from '@nestjs/common'
import { AlbumsService } from './albums.service'
import { AlbumsController } from './albums.controller'
import { ServiceModule } from '../infra/service/service.module'
import { AlbumRepository } from './album.repository'
import { SpannerService } from '../infra/service/spanner.service'
import { Album } from './entities/album.entity'

@Module({
  imports: [ServiceModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, {
    provide: AlbumRepository,
    useFactory: (spanner: SpannerService) => {
      return new AlbumRepository(spanner, Album)
    },
    inject: [SpannerService]
  }],
})
export class AlbumsModule {}
