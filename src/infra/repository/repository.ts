import { SpannerService } from '../service/spanner.service'

export class Repository<Entity> {
  constructor(private readonly spanner: SpannerService) {}

  insert(entity: Entity): Entity {
    return null
  }
  findAll(): Entity[] {
    return null
  }
  findOne(id: string): Entity {
    return null
  }
  delete(id: string): Entity {
    return null
  }
}
