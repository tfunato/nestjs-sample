export function Entity(name?: string): ClassDecorator

export function Entity(
    name?: string
): ClassDecorator {
    return function (target) {
        getMetadataArgsStorage().tables.push({
            target: target,
            name: name,
            type: "regular",
            orderBy: options.orderBy ? options.orderBy : undefined,
            engine: options.engine ? options.engine : undefined,
            database: options.database ? options.database : undefined,
            schema: options.schema ? options.schema : undefined,
            synchronize: options.synchronize,
            withoutRowid: options.withoutRowid,
        } as TableMetadataArgs)
