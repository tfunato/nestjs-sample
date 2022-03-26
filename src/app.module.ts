import { Module } from '@nestjs/common'
import { HealthCheckController } from './healthcheck.controller'
import { UsersModule } from './users/users.module'

@Module({
  imports: [UsersModule],
  controllers: [HealthCheckController],
})
export class AppModule {}
