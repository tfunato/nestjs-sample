import { Module } from '@nestjs/common'
import { HealthCheckController } from './healthcheck.controller'
import { SingersModule } from './singers/singers.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [SingersModule, AlbumsModule],
  controllers: [HealthCheckController],
})
export class AppModule {}
