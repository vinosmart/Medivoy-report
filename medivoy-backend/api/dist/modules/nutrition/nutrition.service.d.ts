import { ConfigService } from '@nestjs/config';
export interface NutritionGuidanceDto {
    goal: string;
    diet?: string;
    region?: string;
    memberName?: string;
    relation?: string;
    age?: string;
    conditions?: string;
    reportSummary?: string;
}
export declare class NutritionService {
    private config;
    private readonly mistralUrl;
    constructor(config: ConfigService);
    getGuidance(dto: NutritionGuidanceDto): Promise<any>;
}
