import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
export declare class ProfileService {
    private repo;
    constructor(repo: Repository<Profile>);
    upsert(userId: string, dto: Partial<Profile>): Promise<Profile>;
    findByUser(userId: string): Promise<Profile>;
}
