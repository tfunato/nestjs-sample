import { Controller, Get } from '@nestjs/common'

@Controller()
export class HealthCheckController {
  @Get()
  ok(): string {
    return 'OK'
  }
}
