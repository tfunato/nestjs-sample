import { Module } from '@nestjs/common'
import { SpannerService } from './spanner.service'

@Module({
  providers: [SpannerService],
})
export class ServiceModule {}
