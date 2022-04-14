/* eslint-disable */
import { FindOptionsWhere } from './find-option-where'
import { FindOptionsOrder } from './find-options-order'

/**
 * Defines a special criteria to find specific entity.
 */
export interface FindOneOptions<Entity = any> {
  /**
   * Simple condition that should be applied to match entities.
   */
  where?: FindOptionsWhere<Entity>

  /**
   * Order, in which entities should be ordered.
   */
  order?: FindOptionsOrder<Entity>
}
