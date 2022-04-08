import { ColumnMetaDataArgs } from '../meta-data/column-meta-data-args'
import { getMetadataArgsStorage } from '../globals'

export function Column(): PropertyDecorator

export function Column(): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    getMetadataArgsStorage().columns.push({
      target: object.constructor,
      propertyName: propertyName,
      repositoryName: object.constructor.name + 'Repository'
    } as ColumnMetaDataArgs)
  }
}
