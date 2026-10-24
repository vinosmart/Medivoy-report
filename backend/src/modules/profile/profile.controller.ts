import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ProfileService } from './profile.service'

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private svc: ProfileService) {}

  @Post()
  upsert(@Req() req: any, @Body() body: any) {
    return this.svc.upsert(req.user.userId, body)
  }

  @Get()
  find(@Req() req: any) {
    return this.svc.findByUser(req.user.userId)
  }
}