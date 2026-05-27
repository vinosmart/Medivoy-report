import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { GeneticsService } from './genetics.service'

@Controller('genetics')
@UseGuards(JwtAuthGuard)
export class GeneticsController {
  constructor(private svc: GeneticsService) {}

  @Post()
  upsert(@Req() req: any, @Body() body: any) {
    return this.svc.upsert(req.user.userId, body)
  }

  @Get()
  find(@Req() req: any) {
    return this.svc.findByUser(req.user.userId)
  }
}