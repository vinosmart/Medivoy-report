import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { AiService } from '../ai/ai.service';
export declare class ReportsService {
    private repo;
    private aiService;
    constructor(repo: Repository<Report>, aiService: AiService);
    create(userId: string, title: string, type: string, fileUrl: string, forMember?: string, filePath?: string): Promise<Report>;
    private processReport;
    private hasColumn;
    private readFallbackText;
    private extractBloodMarkersFromText;
    private extractDnaFindingsAsMarkers;
    private extractTextFromFile;
    private extractFromPdf;
    private looksLikePdfBinary;
    private ocrPdfFallback;
    private extractFromImage;
    private ocrImages;
    private normalizeUnit;
    findByUser(userId: string): Promise<Report[]>;
    findOne(id: string, userId: string): Promise<Report>;
    update(id: string, updates: Partial<Report>): Promise<Report>;
    remove(id: string, userId: string): Promise<{
        message: string;
        id: string;
    }>;
    private uniqueMarkers;
}
