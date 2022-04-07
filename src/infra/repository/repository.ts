import { SpannerService } from '../service/spanner.service'
import { getMetadataArgsStorage } from './globals'
import { Row } from '@google-cloud/spanner/build/src/partial-result-stream'

export class Repository<Entity> {
  readonly spanner: SpannerService
  readonly target: Entity

  constructor(spanner: SpannerService) {
    this.spanner = spanner
  }

  insert(entity: Entity): Entity {
    return null
  }
  async findAll(): Promise<Entity[]> {
    const metaTable = getMetadataArgsStorage().filterTables(
      this.target.constructor,
    )[0]
    const metaColumns = getMetadataArgsStorage().filterColumns(
      this.target.constructor,
    )
    let query = 'SELECT '
    const columnNames: string[] = metaColumns.map((column) => {
      return column.propertyName
    })
    query = query.concat(columnNames.join(', '))
    query.concat(' FROM ').concat(metaTable.name)

    const [rows] = await this.spanner.getDb().run(query)
    const entities: Entity[] = rows.map<Entity>((row: Row) => {
      const entity = Object.create(metaTable.target.prototype)
      columnNames.forEach((columnName) => {
        const descriptor = Object.getOwnPropertyDescriptor(entity, columnName)
        if (descriptor) {
          const rowJson = row.toJSON()
        }
      })
      return entity
    })
    //    target.test = 'hoge'
    return null
  }
  findOne(id: string): Entity {
    return null
  }
  delete(id: string): Entity {
    return null
  }
}
