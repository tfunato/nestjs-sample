import { Module } from '@nestjs/common'
import { HealthCheckController } from './healthcheck.controller'
import { SingersModule } from './singers/singers.module'
import { AlbumsModule } from './albums/albums.module'
import { ServiceModule } from './infra/service/service.module'

@Module({
  imports: [SingersModule, AlbumsModule, ServiceModule],
  controllers: [HealthCheckController],
})
export class AppModule {}
