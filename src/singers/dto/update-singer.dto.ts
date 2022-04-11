import { CreateSingerDto } from './create-singer.dto'
import { PartialType } from '@nestjs/mapped-types'

export class UpdateSingerDto extends PartialType(CreateSingerDto) {}
