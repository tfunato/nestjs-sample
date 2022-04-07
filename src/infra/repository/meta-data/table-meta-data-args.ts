/* eslint-disable */
export interface TableMetaDataArgs {
  /**
   * Class to which table is applied.
   * Function target is a table defined in the class.
   * String target is a table defined in a json schema.
   */
  target: Function
  /**
   * Table's name. If name is not set then table's name will be generated from target's name.
   */
  name?: string
}
