import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CosService } from './cos.service';
import cosConfig from '../config/cos';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [cosConfig],
    }),
  ],
  providers: [CosService],
  exports: [CosService],
})
export class CosModule {}
