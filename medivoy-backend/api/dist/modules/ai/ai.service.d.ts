import { ConfigService } from '@nestjs/config';
export type Marker = {
    name: string;
    value: string;
    unit?: string;
    referenceRange?: string;
};
export type FindingStatus = 'normal' | 'borderline' | 'mild_high' | 'moderate_high' | 'critical_high' | 'mild_low' | 'critical_low';
export type Finding = {
    label: string;
    status: FindingStatus;
    value: string;
    severityScore?: number;
    note?: string;
    whyItMatters?: string;
    possibleCauses?: string[];
    recommendedActions?: string[];
};
export type PatternInsight = {
    title: string;
    severity: 'low' | 'moderate' | 'high';
    insight: string;
};
export type TraitInsight = {
    trait: string;
    result: string;
    basedOn: string[];
    insight: string;
};
export type LongTermRiskInsight = {
    horizonYears: number;
    title: string;
    outlook: 'low' | 'moderate' | 'high';
    insight: string;
};
export type FiveYearAnswer = {
    year: number;
    question: string;
    answer: string;
    outlook: 'low' | 'moderate' | 'high';
};
export type AnalyzeResult = {
    reportType: 'blood' | 'dna' | 'other';
    overallHealthScore: number;
    confidenceScore: number;
    summary: string;
    longTermInsights?: LongTermRiskInsight[];
    fiveYearAnswers?: FiveYearAnswer[];
    riskCategories?: Record<string, number>;
    keyInsights?: string[];
    positiveFindings?: string[];
    criticalFindings?: string[];
    missingImportantMarkers?: string[];
    patternAnalysis?: PatternInsight[];
    recommendations: {
        diet: string[];
        exercise: string[];
        sleep: string[];
        supplements: string[];
        followUp: string[];
    };
    findings: Finding[];
    dnaTraits?: TraitInsight[];
    warnings?: string[];
};
export declare class AiService {
    private configService;
    private mistral;
    constructor(configService: ConfigService);
    analyzeReport(text: string, markers: Marker[], type: string): Promise<AnalyzeResult>;
    private normalizeText;
    private resolveReportType;
    private hasBloodSignals;
    private hasDnaSignals;
    private callAi;
    private emptyReport;
    private analyzeBloodReport;
    private extractBloodMarkers;
    private analyzeDnaReport;
    private analyzeOtherReport;
    private buildOtherFallback;
    private buildDefaultFiveYearAnswers;
    private buildBloodFallbackFindings;
    private buildBloodRecommendations;
    private buildBloodLongTermInsights;
    private buildBloodKeyInsights;
    private detectBloodPatterns;
    private calculateBloodCategoryScores;
    private calculateWeightedHealthScore;
    private normalizeFiveYearAnswers;
    private normalizeFindings;
    private normalizePatternInsights;
    private normalizeTraits;
    private normalizeLongTermInsights;
    private normalizeRecommendations;
    private normalizeRiskCategories;
    private normalizeStringArray;
    private normalizeStatus;
    private normalizePatternSeverity;
    private normalizeOutlook;
    private getString;
    private toNumber;
    private uniqueMarkers;
    private detectMissingMarkers;
}
