import { Module } from '@nestjs/common'
import { AlbumsService } from './albums.service'
import { AlbumsController } from './albums.controller'
import { ServiceModule } from '../infra/service/service.module'

@Module({
  imports: [ServiceModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
