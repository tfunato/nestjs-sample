import { Entity } from '../../infra/repository/decorator/entity'
import { Column } from '../../infra/repository/decorator/column'

@Entity('Albums')
export class Album {
  @Column()
  singerId: number

  @Column()
  albumId: number

  @Column()
  albumTitle: string
}
