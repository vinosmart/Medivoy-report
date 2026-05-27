import { GeneticsService } from './genetics.service';
export declare class GeneticsController {
    private svc;
    constructor(svc: GeneticsService);
    upsert(req: any, body: any): Promise<import("./entities/genetics.entity").Genetics>;
    find(req: any): Promise<import("./entities/genetics.entity").Genetics>;
}
