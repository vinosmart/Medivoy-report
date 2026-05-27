import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Profile } from './entities/profile.entity'

@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private repo: Repository<Profile>) {}

  async upsert(userId: string, dto: Partial<Profile>) {
    let profile = await this.repo.findOne({ where: { userId } })
    if (profile) {
      await this.repo.update(profile.id, dto)
      return this.repo.findOne({ where: { userId } })
    }
    const created = this.repo.create({ ...dto, userId })
    return this.repo.save(created)
  }

  async findByUser(userId: string) {
    return this.repo.findOne({ where: { userId } })
  }
}