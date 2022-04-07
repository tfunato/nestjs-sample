import { SpannerService } from '../service/spanner.service'
import { getMetadataArgsStorage } from './globals'

export class Repository<Entity> {
  readonly target: Function
  readonly spanner: SpannerService

  constructor(
    target: Function,
    spanner: SpannerService
  ) {
    this.target = target
    this.spanner = spanner
  }

  insert(entity: Entity): Entity {
    return null
  }
  findAll(): Entity[] {
    const tableMetaData = getMetadataArgsStorage().filterTables(this.target.constructor)[0]
    const columnMetaDatas = getMetadataArgsStorage().filterColumns(this.target.constructor)


    const target = Object.create(tableMetaData.target.prototype)
    return null
  }
  findOne(id: string): Entity {
    return null
  }
  delete(id: string): Entity {
    return null
  }

  protected create<Entity>(ctor: { new(): Entity}) {
    return new ctor()
  }
}
