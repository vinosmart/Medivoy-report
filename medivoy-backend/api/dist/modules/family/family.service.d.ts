import { Repository } from 'typeorm';
import { FamilyMember } from './entities/family-member.entity';
export declare class FamilyService {
    private repo;
    constructor(repo: Repository<FamilyMember>);
    create(userId: string, dto: Partial<FamilyMember>): Promise<FamilyMember>;
    findByUser(userId: string): Promise<FamilyMember[]>;
    remove(id: string, userId: string): Promise<{
        message: string;
        id: string;
    }>;
}
