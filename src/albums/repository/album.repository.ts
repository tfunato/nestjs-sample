import { Injectable } from '@nestjs/common'
import { SpannerService } from '../../infra/service/spanner.service'

@Injectable()
export class AlbumRepository {
  constructor(private readonly spanner: SpannerService) {}

  async 
}