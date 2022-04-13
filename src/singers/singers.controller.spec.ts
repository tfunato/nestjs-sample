import { SingersController } from './singers.controller'
import { SingersService } from './singers.service'
import { Test, TestingModule } from '@nestjs/testing'

describe('SingersController', () => {
  let controller: SingersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SingersController],
      providers: [SingersService],
    }).compile()

    controller = module.get<SingersController>(SingersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
