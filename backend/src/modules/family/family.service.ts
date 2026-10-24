import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FamilyMember } from './entities/family-member.entity'

@Injectable()
export class FamilyService {
  constructor(@InjectRepository(FamilyMember) private repo: Repository<FamilyMember>) {}

  async create(userId: string, dto: Partial<FamilyMember>) {
    const member = this.repo.create({ ...dto, userId })
    return this.repo.save(member)
  }

  async findByUser(userId: string) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'ASC' } })
  }

  async remove(id: string, userId: string) {
    const member = await this.repo.findOne({ where: { id, userId } })
    if (!member) throw new HttpException('Member not found', 404)
    await this.repo.delete(id)
    return { message: 'Deleted', id }
  }
}