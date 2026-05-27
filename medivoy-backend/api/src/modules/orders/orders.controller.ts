import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { OrdersService } from './orders.service'

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.svc.create(req.user.userId, body)
  }

  @Get()
  findAll(@Req() req: any) {
    return this.svc.findByUser(req.user.userId)
  }

  @Patch(':id/status')
  updateStatus(@Req() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    return this.svc.updateStatus(id, req.user.userId, body.status)
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.svc.remove(id, req.user.userId)
  }
}