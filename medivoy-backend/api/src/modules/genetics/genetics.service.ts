import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Genetics } from './entities/genetics.entity'

@Injectable()
export class GeneticsService {
  constructor(@InjectRepository(Genetics) private repo: Repository<Genetics>) {}

  async upsert(userId: string, dto: Partial<Genetics>) {
    let record = await this.repo.findOne({ where: { userId } })
    if (record) {
      await this.repo.update(record.id, dto)
      return this.repo.findOne({ where: { userId } })
    }
    const created = this.repo.create({ ...dto, userId })
    return this.repo.save(created)
  }

  async findByUser(userId: string) {
    return this.repo.findOne({ where: { userId } })
  }
}