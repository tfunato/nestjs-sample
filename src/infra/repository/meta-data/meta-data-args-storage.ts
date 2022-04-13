import { ColumnMetaDataArgs } from './column-meta-data-args'
import { TableMetaDataArgs } from './table-meta-data-args'

/* eslint-disable */
export class MetaDataArgsStorage {
  readonly tables: TableMetaDataArgs[] = []
  readonly columns: ColumnMetaDataArgs[] = []

  filterTables(
    target: (Function | string) | (Function | string)[],
  ): TableMetaDataArgs[] {
    return this.filterByTarget(this.tables, target)
  }

  filterColumns(
    target: (Function | string) | (Function | string)[],
  ): ColumnMetaDataArgs[] {
    return this.filterByTargetAndWithoutDuplicateProperties(
      this.columns,
      target,
    )
  }

  /**
   * Filters given array by a given target or targets.
   */
  protected filterByTarget<T extends { target: Function | string }>(
    array: T[],
    target: (Function | string) | (Function | string)[],
  ): T[] {
    return array.filter((table) => {
      return Array.isArray(target)
        ? target.indexOf(table.target) !== -1
        : table.target === target
    })
  }

  /**
   * Filters given array by a given target or targets and prevents duplicate property names.
   */
  protected filterByTargetAndWithoutDuplicateProperties<
    T extends { target: Function | string; propertyName: string },
  >(array: T[], target: (Function | string) | (Function | string)[]): T[] {
    const newArray: T[] = []
    array.forEach((item) => {
      const sameTarget = Array.isArray(target)
        ? target.indexOf(item.target) !== -1
        : item.target === target
      if (sameTarget) {
        if (
          !newArray.find(
            (newItem) => newItem.propertyName === item.propertyName,
          )
        )
          newArray.push(item)
      }
    })
    return newArray
  }
}
