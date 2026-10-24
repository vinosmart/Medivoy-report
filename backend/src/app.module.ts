import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { ReportsModule } from './modules/reports/reports.module'
import { AiModule } from './modules/ai/ai.module'
import { FamilyModule } from './modules/family/family.module'
import { OrdersModule } from './modules/orders/orders.module'
import { ProfileModule } from './modules/profile/profile.module'
import { GeneticsModule } from './modules/genetics/genetics.module'
import { NutritionModule } from './modules/nutrition/nutrition.module'
import { PharmacyModule } from './modules/pharmacy/pharmacy.module'
import { UnlimitedOcrModule } from './modules/unlimited-ocr/unlimited-ocr.module'
import { User } from './modules/auth/entities/user.entity'
import { Report } from './modules/reports/entities/report.entity'
import { FamilyMember } from './modules/family/entities/family-member.entity'
import { Order } from './modules/orders/entities/order.entity'
import { Profile } from './modules/profile/entities/profile.entity'
import { Genetics } from './modules/genetics/entities/genetics.entity'

const entities = [User, Report, FamilyMember, Order, Profile, Genetics]

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (process.env.DATABASE_URL) {
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities,
            synchronize: true,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          }
        }

        return {
          type: 'sqljs',
          location: process.env.SQLITE_PATH || './data/medivoy.db',
          entities,
          synchronize: true,
        }
      },
    }),
    AuthModule,
    ReportsModule,
    AiModule,
    FamilyModule,
    OrdersModule,
    ProfileModule,
    GeneticsModule,
    NutritionModule,
    PharmacyModule,
    UnlimitedOcrModule,
  ],
})
export class AppModule { }