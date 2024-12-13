import { Module } from '@nestjs/common';
import { Logger } from './index';

@Module({
  providers: [Logger],
  exports: [Logger]
})
export class SystemModule {}
