import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Report } from './entities/report.entity'

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>,
  ) {}

  async create(userId: string, title: string, type: string, fileUrl: string) {
    const report = this.repo.create({
      userId,
      title,
      type,
      fileUrl,
      status: 'pending',
    })
    return await this.repo.save(report)
  }

  async findByUser(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string, userId: string) {
    const report = await this.repo.findOne({
      where: { id, userId },
    })
    if (!report) throw new HttpException('Report not found', 404)
    return report
  }
async update(id: string, updates: Partial<Report>) {
  await this.repo.update(id, updates)
  return this.repo.findOne({ where: { id } })
}
}