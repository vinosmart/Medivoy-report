import { Repository } from 'typeorm';
import { Genetics } from './entities/genetics.entity';
export declare class GeneticsService {
    private repo;
    constructor(repo: Repository<Genetics>);
    upsert(userId: string, dto: Partial<Genetics>): Promise<Genetics>;
    findByUser(userId: string): Promise<Genetics>;
}
