import { FamilyService } from './family.service';
export declare class FamilyController {
    private svc;
    constructor(svc: FamilyService);
    create(req: any, body: any): Promise<import("./entities/family-member.entity").FamilyMember>;
    findAll(req: any): Promise<import("./entities/family-member.entity").FamilyMember[]>;
    remove(req: any, id: string): Promise<{
        message: string;
        id: string;
    }>;
}
