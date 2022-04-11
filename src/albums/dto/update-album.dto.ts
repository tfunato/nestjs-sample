import { CreateAlbumDto } from './create-album.dto'
import { PartialType } from '@nestjs/mapped-types'

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
