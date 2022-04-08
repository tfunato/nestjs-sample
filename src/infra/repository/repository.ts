import { SpannerService } from '../service/spanner.service'
import { getMetadataArgsStorage } from './globals'
import { Row } from '@google-cloud/spanner/build/src/partial-result-stream'
import { Logger } from '@nestjs/common'
import { TableMetaDataArgs } from './meta-data/table-meta-data-args'
import { ColumnMetaDataArgs } from './meta-data/column-meta-data-args'

export class Repository<T> {
  readonly spanner: SpannerService
  private readonly logger = new Logger(Repository.name);
  private readonly target

  constructor(spanner: SpannerService, ctor: { new(): T}) {
    this.spanner = spanner
    this.target = new ctor()
  }

  async insert(entity: T): Promise<T> {
    const meta = this.getMetaData()
    let query = 'INSERT '
    query = query.concat(meta.metaTable.name)
    query = query.concat('(')
    const columnNames: string[] = meta.metaColumns.map((column) => {
      return column.propertyName
    })
    query = query.concat(columnNames.join(', ')).concat(' ) VALUES (@')
    query = query.concat(columnNames.join(', @'))
    query = query.concat(')')

    const database = this.spanner.getDb()
    database.runTransaction(async (err, transaction) => {
      if (err) {
        console.error(err);
        return;
      }
      const param = {}
      columnNames.forEach((columnName)=> {
        param[columnName] = entity[columnName]
      })
      try {
        const [rowCount] = await transaction.runUpdate({
          sql: query,
          params: param,
        });
        this.logger.log( query)
        this.logger.log('insert row count:' + rowCount)
        await transaction.commit();
      } catch (err) {
        throw err
      } finally {
        // no op
      }
    })
    return entity
  }
  async findAll(): Promise<T[]> {
    const meta = this.getMetaData()
    let query = 'SELECT '
    const columnNames: string[] = meta.metaColumns.map((column) => {
      return column.propertyName
    })
    query = query.concat(columnNames.join(', '))
    query = query.concat(' FROM ').concat(meta.metaTable.name)

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

  protected getMetaData(): {metaTable: TableMetaDataArgs, metaColumns: ColumnMetaDataArgs[]} {
    const metaTable = getMetadataArgsStorage().filterTables(
      this.target.constructor
    )[0]
    const metaColumns = getMetadataArgsStorage().filterColumns(
      this.target.constructor
    )
    return {metaTable, metaColumns}
  }
}
