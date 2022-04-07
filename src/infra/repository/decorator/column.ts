import { ColumnMetadataArgs } from '../meta-data/ColumnMetadataArgs'
import { getMetadataArgsStorage } from '../globals'

export function Column(): PropertyDecorator

export function Column(): PropertyDecorator {
  return function (object: Object, propertyName: string) {

      getMetadataArgsStorage().columns.push({
        target: object.constructor,
        propertyName: propertyName,
      } as ColumnMetadataArgs)
  }
}
