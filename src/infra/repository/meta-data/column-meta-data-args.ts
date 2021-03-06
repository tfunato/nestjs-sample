/* eslint-disable */
export interface ColumnMetaDataArgs {
  /**
   * Class to which column is applied.
   */
  readonly target: Function | string

  /**
   * Class's property name to which column is applied.
   */
  readonly propertyName: string

  /**
   * Primary column flag
   */
  readonly primary: boolean

  /**
   * Target RepositoryName
   */
  readonly repositoryName: string
}
