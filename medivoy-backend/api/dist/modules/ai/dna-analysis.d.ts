export type DnaMarker = {
    name: string;
    value: string;
    unit?: string;
};
export type DnaAnalysis = {
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
export declare function analyzeDna(markers: DnaMarker[]): DnaAnalysis;
