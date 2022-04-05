import { Module } from '@nestjs/common'
import { SpannerService } from './spanner.service'

@Module({
  providers: [SpannerService],
  exports: [SpannerService],
})
export class ServiceModule {}
