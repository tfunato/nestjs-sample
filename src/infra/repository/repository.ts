import { SpannerService } from '../service/spanner.service'
import { getMetadataArgsStorage } from './globals'
import { Row } from '@google-cloud/spanner/build/src/partial-result-stream'
import { Logger } from '@nestjs/common'

export class Repository<T> {
  readonly spanner: SpannerService
  private readonly logger = new Logger(Repository.name);
  private readonly target

  constructor(spanner: SpannerService, ctor: { new(): T}) {
    this.spanner = spanner
    this.target = new ctor()
  }

  async insert(entity: T): Promise<T> {
    return null
  }
  async findAll(): Promise<T[]> {
    const metaTable = getMetadataArgsStorage().filterTables(
      this.target.constructor
    )[0]
    const metaColumns = getMetadataArgsStorage().filterColumns(
      this.target.constructor
    )
    let query = 'SELECT '
    const columnNames: string[] = metaColumns.map((column) => {
      return column.propertyName
    })
    query = query.concat(columnNames.join(', '))
    query = query.concat(' FROM ').concat(metaTable.name)

    this.logger.log(query)

    const [rows] = await this.spanner.getDb().run(query)
    const entities: T[] = rows.map<T>((row: Row) => {
      const entity = new this.target.constructor
      columnNames.forEach((columnName) => {
        const rowJson = row.toJSON()
        entity[columnName] = rowJson[columnName]
      })
      return entity
    })
    return entities
  }
  findOne(id: string): T {
    return null
  }
  delete(id: string): T {
    return null
  }
}
