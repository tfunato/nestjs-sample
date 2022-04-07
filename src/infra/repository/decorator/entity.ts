import { getMetadataArgsStorage } from '../globals'
import { TableMetadataArgs } from '../meta-data/TableMetadataArgs'

export function Entity(name?: string): ClassDecorator

export function Entity(
    name?: string
): ClassDecorator {
    return function(target) {
        getMetadataArgsStorage().tables.push({
            target: target,
            name: name,
        } as TableMetadataArgs)
    }
}
