import { getMetadataArgsStorage } from '../globals'
import { TableMetaDataArgs } from '../meta-data/table-meta-data-args'

export function Entity(name: string): ClassDecorator

export function Entity(name: string): ClassDecorator {
  return function (target) {
    getMetadataArgsStorage().tables.push({
      target: target,
      name: name,
      repositoryName: target.name + 'Repository',
    } as TableMetaDataArgs)
  }
}
