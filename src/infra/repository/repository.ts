/* eslint-disable */
import { SpannerService } from '../service/spanner.service'
import { FindOneOptions } from './find-option/find-one-option'
import { getMetadataArgsStorage } from './globals'
import { ColumnMetaDataArgs } from './meta-data/column-meta-data-args'
import { TableMetaDataArgs } from './meta-data/table-meta-data-args'
import { Row } from '@google-cloud/spanner/build/src/partial-result-stream'
import { Logger } from '@nestjs/common'
import { Database } from '@google-cloud/spanner/build/src/database'

type Meta = {
  metaTable: TableMetaDataArgs
  metaColumns: ColumnMetaDataArgs[]
}

export class Repository<T> {
  readonly spanner: SpannerService
  private readonly logger = new Logger(Repository.name)
  private readonly target

  constructor(spanner: SpannerService, ctor: { new (): T }) {
    this.spanner = spanner
    this.target = new ctor()
  }

  async insert(entity: T): Promise<T> {
    const meta = this.getMetaData()
    let query = 'INSERT '
    query = query.concat(meta.metaTable.name)
    query = query.concat(' (')
    const columnNames: string[] = meta.metaColumns.map((column) => {
      return column.propertyName
    })

    const params = {}
    const nullColumns: string[] = []
    const filteredColumns = columnNames.filter((columnName) => {
      const value = entity[columnName]
      if (value === undefined) {
        return false
      } else if (value === null) {
        nullColumns.push(columnName)
        return false
      } else {
        params[columnName] = value
        return true
      }
    })

    query = query.concat(filteredColumns.join(', '))
    if (nullColumns.length > 0) {
      query = query.concat(', ').concat(nullColumns.join(', '))
    }
    query = query.concat(' ) VALUES (@')
    query = query.concat(filteredColumns.join(', @'))
    nullColumns.forEach((colum) => {
      query = query.concat(', NULL')
    })
    query = query.concat(')')

    this.logger.log(query)
    this.logger.log(JSON.stringify(params))

    const database: Database = this.spanner.getDb()
    try {
      await database.runTransactionAsync(async (transaction) => {
        const [rowCount] = await transaction.runUpdate({
          sql: query,
          params: params,
        })
        this.logger.log('insert row count:' + rowCount.toString())
        await transaction.commit()
      })
    } catch (err) {
      throw err
    }
    return entity
  }
  async findAll(): Promise<T[]> {
    const columnNames = this.getColumnNames()
    const query = this.baseSelectQuery(columnNames, this.getMetaData())

    this.logger.log(query)

    try {
      const [rows] = await this.spanner.getDb().run(query)
      return rows.map<T>((row: Row) => {
        return this.mapEntity(row, columnNames)
      })
    } catch (err) {
      throw err
    }
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    const columnNames = this.getColumnNames()
    const params = {}
    let sql = this.baseSelectQuery(columnNames, this.getMetaData())
    sql = sql.concat(' WHERE ')
    const wheres: string[] = Object.keys(options.where).map((key: string) => {
      params[key] = options.where[key]
      return key + '=@' + key + ' '
    })
    sql = sql.concat(wheres.join(' AND '))
    sql = sql.concat(' LIMIT 1')
    this.logger.log(sql)
    this.logger.log(JSON.stringify(params))

    try {
      const [rows] = await this.spanner.getDb().run({
        json: false,
        sql: sql,
        params: params,
      })
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
  async deleteByPK(options: FindOneOptions<T>): Promise<number> {
    const meta: Meta = this.getMetaData()
    // check pk
    const pkColumns = meta.metaColumns
      .filter((metaColumn) => {
        return metaColumn.primary == true
      })
      .map((column) => {
        return column.propertyName
      })
    if (pkColumns.length == 0) {
      throw new Error('pk column not found')
    }
    pkColumns.forEach((pkColumn) => {
      if (!(pkColumn in options.where)) {
        throw new Error('pk column must set')
      }
    })
    let sql = 'DELETE FROM '.concat(meta.metaTable.name).concat(' WHERE ')
    const params = {}
    const wheres: string[] = Object.keys(options.where).map((key: string) => {
      params[key] = options.where[key]
      return key + '=@' + key + ' '
    })
    sql = sql.concat(wheres.join(' AND '))

    this.logger.log(sql)
    this.logger.log(JSON.stringify(params))

    let count = 0
    const db = await this.spanner.getDb()
    try {
      await db.runTransactionAsync(async (transaction) => {
        const [rowCount] = await transaction.runUpdate({
          sql: sql,
          params: params,
        })
        this.logger.log(sql)
        this.logger.log('delete row count:' + rowCount)
        await transaction.commit()
        count = rowCount
      })
    } catch (err) {
      throw err
    }
    return count
  }

  async updateByPK(entity: T): Promise<number> {
    const meta: Meta = this.getMetaData()
    // check pk
    const pkColumns = meta.metaColumns
      .filter((metaColumn) => {
        return metaColumn.primary == true
      })
      .map((column) => {
        return column.propertyName
      })
    if (pkColumns.length == 0) {
      throw new Error('pk column not found.set pk column in entity')
    }
    pkColumns.forEach((pkColumn: string) => {
      if (!entity[pkColumn]) {
        throw new Error('pk column value must set.')
      }
    })
    let sql = 'UPDATE '.concat(meta.metaTable.name).concat(' SET ')
    const setters: string[] = []
    const wheres: string[] = []
    const params = {}
    Object.keys(entity).forEach((key: string) => {
      if (pkColumns.includes(key)) {
        wheres.push(key + '=@' + key)
        params[key] = entity[key]
      } else {
        if (entity[key]) {
          setters.push(key + '=@' + key)
          params[key] = entity[key]
        }
      }
    })
    sql = sql.concat(setters.join(' , '))
    sql = sql.concat(' WHERE ').concat(wheres.join(' AND '))
    const db = await this.spanner.getDb()
    let count = 0
    try {
      await db.runTransactionAsync(async (transaction) => {
        const [rowCount] = await transaction.runUpdate({
          sql: sql,
          params: params,
        })
        this.logger.log(sql)
        this.logger.log(JSON.stringify(params))
        this.logger.log('update row count:' + rowCount)
        await transaction.commit()
        count = rowCount
      })
    } catch (err) {
      throw err
    }
    return count
  }

  protected getMetaData(): Meta {
    const metaTable = getMetadataArgsStorage().filterTables(
      this.target.constructor,
    )[0]
    const metaColumns = getMetadataArgsStorage().filterColumns(
      this.target.constructor,
    )
    return { metaTable, metaColumns }
  }

  protected mapEntity(row: Row, columnNames: string[]): T {
    const entity = new this.target.constructor()
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
