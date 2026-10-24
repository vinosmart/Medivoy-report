import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PharmacyService } from './pharmacy.service'
import { PharmacyController } from './pharmacy.controller'
import { Report } from '../reports/entities/report.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [PharmacyService],
  controllers: [PharmacyController],
})
export class PharmacyModule {}
