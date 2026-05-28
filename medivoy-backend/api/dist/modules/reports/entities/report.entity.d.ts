export type ReportRecommendations = {
    diet: string[];
    exercise: string[];
    sleep: string[];
    supplements: string[];
    followUp: string[];
};
export type FiveYearAnswer = {
    year: number;
    question: string;
    answer: string;
    outlook: 'low' | 'moderate' | 'high';
};
export type LongTermRiskInsight = {
    horizonYears: number;
    title: string;
    outlook: 'low' | 'moderate' | 'high';
    insight: string;
};
export declare class Report {
    id: string;
    userId: string;
    title: string;
    type: string;
    fileUrl: string;
    forMember: string;
    status: string;
    riskScore: number | null;
    overallHealthScore: number | null;
    confidenceScore: number | null;
    reportType: string | null;
    summary: string | null;
    recommendations: ReportRecommendations | null;
    findings: any[] | null;
    markers: any[] | null;
    longTermInsights: LongTermRiskInsight[] | null;
    fiveYearAnswers: FiveYearAnswer[] | null;
    riskCategories: Record<string, number> | null;
    keyInsights: string[] | null;
    positiveFindings: string[] | null;
    criticalFindings: string[] | null;
    missingImportantMarkers: string[] | null;
    patternAnalysis: any[] | null;
    dnaTraits: any[] | null;
    warnings: string[] | null;
    extractedText: string | null;
    createdAt: Date;
}
