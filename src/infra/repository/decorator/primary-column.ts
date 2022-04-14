/* eslint-disable */
import { getMetadataArgsStorage } from '../globals'
import { ColumnMetaDataArgs } from '../meta-data/column-meta-data-args'

export function PrimaryColumn(): PropertyDecorator

export function PrimaryColumn(): PropertyDecorator {
  return function (object: Object, propertyName: string) {
    getMetadataArgsStorage().columns.push({
      target: object.constructor,
      propertyName: propertyName,
      primary: true,
      repositoryName: object.constructor.name + 'Repository',
    } as ColumnMetaDataArgs)
  }
}
