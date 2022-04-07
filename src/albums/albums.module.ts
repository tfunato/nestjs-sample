import { Module } from '@nestjs/common'
import { AlbumsService } from './albums.service'
import { AlbumsController } from './albums.controller'
import { ServiceModule } from '../infra/service/service.module'
import { AlbumRepository } from './album.repository'

@Module({
  imports: [ServiceModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumRepository],
})
export class AlbumsModule {}
