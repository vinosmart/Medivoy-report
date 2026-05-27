import { NutritionService, NutritionGuidanceDto } from './nutrition.service';
export declare class NutritionController {
    private svc;
    constructor(svc: NutritionService);
    getGuidance(body: NutritionGuidanceDto): Promise<any>;
}
