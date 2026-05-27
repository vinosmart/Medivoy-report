import { ConfigService } from '@nestjs/config';
export type Marker = {
    name: string;
    value: string;
    unit?: string;
    referenceRange?: string;
};
type Finding = {
    label: string;
    status: 'high' | 'low' | 'normal';
    value: string;
    note?: string;
};
type AnalyzeResult = {
    riskScore: number;
    summary: string;
    recommendations: string[];
    findings: Finding[];
};
export declare class AiService {
    private configService;
    private mistral;
    constructor(configService: ConfigService);
    analyzeReport(text: string, markers: Marker[], type: string): Promise<AnalyzeResult>;
    private resolveReportType;
    private analyzeDnaReport;
    private analyzeBloodReport;
    private normalizeText;
    private detectDnaMode;
    private analyzeDnaWithMistral;
    private extractDnaFindings;
    private extractBloodMarkers;
    private buildBloodFindings;
    private analyzeOtherWithMistral;
    private extractOtherReportFindings;
    private makeFinding;
    private calculateBloodRiskScore;
    private calculateDnaRiskScore;
    private calculateOtherRiskScore;
    private buildBloodRecommendations;
    private buildDnaRecommendations;
    private buildOtherRecommendations;
    private generateRecommendationsFromFindings;
    private sanitizeFindings;
    private sanitizeRecommendations;
    private uniqueMarkers;
    private uniqueFindings;
    private toNumber;
}
export {};
