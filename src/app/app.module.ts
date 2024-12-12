import { Module } from '@nestjs/common';
import { UserModule } from './features/user/user.module';
import { ConfigModule } from './features/config/config.module';

@Module({
  imports: [
    UserModule,
    ConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
