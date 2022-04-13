import { Entity } from '../../infra/repository/decorator/entity'
import { Column } from '../../infra/repository/decorator/column'
import { PrimaryColumn } from '../../infra/repository/decorator/primary-column'

@Entity('Albums')
export class Album {
  @PrimaryColumn()
  singerId: string

  @PrimaryColumn()
  albumId: string

  @Column()
  albumTitle: string
}
