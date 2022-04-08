import { SpannerService } from '../service/spanner.service'
import { getMetadataArgsStorage } from './globals'
import { Row } from '@google-cloud/spanner/build/src/partial-result-stream'
import { Logger } from '@nestjs/common'
import { TableMetaDataArgs } from './meta-data/table-meta-data-args'
import { ColumnMetaDataArgs } from './meta-data/column-meta-data-args'
import { FindOneOptions } from './find-option/find-one-option'

type Meta = {
  metaTable: TableMetaDataArgs,
  metaColumns: ColumnMetaDataArgs[]
}

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
    const columnNames = this.getColumnNames()
    const query = this.baseSelectQuery(columnNames, this.getMetaData())

    this.logger.log(query)

    const [rows] = await this.spanner.getDb().run(query)
    return rows.map<T>((row: Row) => {
      return this.mapEntity(row, columnNames)
    })
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null>  {
    const columnNames = this.getColumnNames()
    const params = {}
    let sql = this.baseSelectQuery(columnNames, this.getMetaData())
    sql = sql.concat(' WHERE ')
    const wheres: string[] = Object.keys(options.where).map((key:string) => {
      params[key] = options.where[key]
      return key + '=@' + key + ' '
    })
    sql = sql.concat(wheres.join(' AND '))
    sql = sql.concat(' LIMIT 1')
    this.logger.log(sql)
    this.logger.log(params)

    try {
      const [rows] = await this.spanner.getDb().run({
        json: false,
        sql: sql,
        params: params
      })
      this.logger.log(rows)
      const entities: T[] = rows.map<T>((row: Row) => {
        return this.mapEntity(row, columnNames)
      })
      if (entities.length > 0) {
        return entities[0]
      } else {
        return null
      }
    } catch (err) {
      throw err
    }
  }
  delete(id: string): T {
    return null
  }


  protected getMetaData(): Meta {
    const metaTable = getMetadataArgsStorage().filterTables(
      this.target.constructor
    )[0]
    const metaColumns = getMetadataArgsStorage().filterColumns(
      this.target.constructor
    )
    return {metaTable, metaColumns}
  }

  protected mapEntity(row: Row, columnNames: string[]): T {
    const entity = new this.target.constructor
    columnNames.forEach((columnName) => {
      const rowJson = row.toJSON()
      entity[columnName] = rowJson[columnName]
    })
    return entity
  }

  protected getColumnNames(): string[] {
    const meta = this.getMetaData()
    return meta.metaColumns.map((column) => {
      return column.propertyName
    })

  }

  protected baseSelectQuery(columnNames: string[], meta: Meta): string {
    let query = 'SELECT '
    query = query.concat(columnNames.join(', '))
    query = query.concat(' FROM ').concat(meta.metaTable.name)
    return query

  }
}
