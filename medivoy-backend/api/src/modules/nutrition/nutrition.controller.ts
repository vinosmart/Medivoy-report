import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { NutritionService, NutritionGuidanceDto } from './nutrition.service'

@Controller('nutrition')
@UseGuards(JwtAuthGuard)
export class NutritionController {
  constructor(private svc: NutritionService) {}

  @Post('guidance')
  getGuidance(@Body() body: NutritionGuidanceDto) {
    return this.svc.getGuidance(body)
  }
}