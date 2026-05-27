import { ReportsService } from './reports.service';
export declare class ReportsController {
    private svc;
    constructor(svc: ReportsService);
    findAll(req: any): Promise<import("./entities/report.entity").Report[]>;
    findOne(req: any, id: string): Promise<import("./entities/report.entity").Report>;
    upload(req: any, file?: Express.Multer.File): Promise<import("./entities/report.entity").Report>;
    remove(req: any, id: string): Promise<{
        message: string;
        id: string;
    }>;
}
