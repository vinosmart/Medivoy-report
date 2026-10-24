import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from './entities/order.entity'

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private repo: Repository<Order>) {}

  async create(userId: string, dto: Partial<Order>) {
    const order = this.repo.create({ ...dto, userId, status: 'processing' })
    return this.repo.save(order)
  }

  async findByUser(userId: string) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } })
  }

  async updateStatus(id: string, userId: string, status: string) {
    const order = await this.repo.findOne({ where: { id, userId } })
    if (!order) throw new HttpException('Order not found', 404)
    await this.repo.update(id, { status })
    return this.repo.findOne({ where: { id } })
  }

  async remove(id: string, userId: string) {
    const order = await this.repo.findOne({ where: { id, userId } })
    if (!order) throw new HttpException('Order not found', 404)
    await this.repo.delete(id)
    return { message: 'Deleted', id }
  }
}