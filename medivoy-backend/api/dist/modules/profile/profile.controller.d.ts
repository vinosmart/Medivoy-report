import { ProfileService } from './profile.service';
export declare class ProfileController {
    private svc;
    constructor(svc: ProfileService);
    upsert(req: any, body: any): Promise<import("./entities/profile.entity").Profile>;
    find(req: any): Promise<import("./entities/profile.entity").Profile>;
}
