import { Module } from '@nestjs/common';
import { SingersService } from './singers.service';
import { SingersController } from './singers.controller';

@Module({
  controllers: [SingersController],
  providers: [SingersService]
})
export class SingersModule {}
