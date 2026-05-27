export declare class Report {
    id: string;
    userId: string;
    title: string;
    type: string;
    fileUrl: string;
    forMember: string;
    status: string;
    riskScore: number;
    summary: string;
    recommendations: string[];
    findings: any[];
    markers: any[];
    extractedText: string;
    createdAt: Date;
}
