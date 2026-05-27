import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { FamilyService } from './family.service'

@Controller('family')
@UseGuards(JwtAuthGuard)
export class FamilyController {
  constructor(private svc: FamilyService) {}

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.svc.create(req.user.userId, body)
  }

  @Get()
  findAll(@Req() req: any) {
    return this.svc.findByUser(req.user.userId)
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.svc.remove(id, req.user.userId)
  }
}