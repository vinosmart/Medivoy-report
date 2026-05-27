export type Marker = {
    name: string;
    value: string;
    unit: string;
};
export type AnalysisResult = {
    riskScore: number;
    summary: string;
    recommendations: string[];
    findings: {
        label: string;
        status: 'high' | 'low' | 'normal';
        value: string;
        note?: string;
    }[];
};
export declare function analyzeMarkers(markers: Marker[]): AnalysisResult;
export declare function buildReportInsight(ocrText: string, markers: Marker[]): AnalysisResult;
