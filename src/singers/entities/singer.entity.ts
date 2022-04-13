import { Entity } from '../../infra/repository/decorator/entity'
import { PrimaryColumn } from '../../infra/repository/decorator/primary-column'
import { Column } from '../../infra/repository/decorator/column'

@Entity('Singers')
export class Singer {
  @PrimaryColumn()
  singerId: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  singerInfo: string
}
