import { SingersService } from './singers.service'
import { Test, TestingModule } from '@nestjs/testing'

describe('SingersService', () => {
  let service: SingersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingersService],
    }).compile()

    service = module.get<SingersService>(SingersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
