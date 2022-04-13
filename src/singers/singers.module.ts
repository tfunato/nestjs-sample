import { Module } from '@nestjs/common'
import { SingersService } from './singers.service'
import { SingersController } from './singers.controller'
import { SingersRepository } from './singers.repository'
import { SpannerService } from '../infra/service/spanner.service'
import { Singer } from './entities/singer.entity'
import { ServiceModule } from '../infra/service/service.module'

@Module({
  imports: [ServiceModule],
  controllers: [SingersController],
  providers: [
    SingersService,
    {provide: SingersRepository,
    useFactory: (spanner: SpannerService) => {
      return new SingersRepository(spanner, Singer)
    },
    inject: [SpannerService]}
  ],
})
export class SingersModule {}
