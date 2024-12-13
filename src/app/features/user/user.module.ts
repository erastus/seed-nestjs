import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SystemModule } from 'system/system.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SystemModule],
})
export class UserModule {}
