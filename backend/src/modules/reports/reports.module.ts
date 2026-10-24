import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReportsController } from './reports.controller'
import { ReportsService } from './reports.service'
import { Report } from './entities/report.entity'
import { AiModule } from '../ai/ai.module'
import { UnlimitedOcrModule } from '../unlimited-ocr/unlimited-ocr.module'
@Module({ imports: [TypeOrmModule.forFeature([Report]), AiModule, UnlimitedOcrModule], controllers: [ReportsController], providers: [ReportsService] })
export class ReportsModule {}
