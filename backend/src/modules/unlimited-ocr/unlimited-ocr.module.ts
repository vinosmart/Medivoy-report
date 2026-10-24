import { Module } from '@nestjs/common'
import { UnlimitedOcrService } from './unlimited-ocr.service'

@Module({
  providers: [UnlimitedOcrService],
  exports: [UnlimitedOcrService],
})
export class UnlimitedOcrModule {}
