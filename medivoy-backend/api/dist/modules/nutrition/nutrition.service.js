"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let NutritionService = class NutritionService {
    constructor(config) {
        this.config = config;
        this.mistralUrl = 'https://api.mistral.ai/v1/chat/completions';
    }
    async getGuidance(dto) {
        const apiKey = this.config.get('MISTRAL_API_KEY');
        if (!apiKey)
            throw new common_1.HttpException('MISTRAL_API_KEY not configured', 500);
        const forContext = dto.memberName
            ? `This guidance is for: ${dto.memberName}${dto.relation ? ' (' + dto.relation + ')' : ''}${dto.age ? ', age ' + dto.age : ''}.`
            : 'This guidance is for the user themselves.';
        const conditionsContext = dto.conditions
            ? `Known medical conditions: ${dto.conditions}. Factor these into food and supplement recommendations.`
            : '';
        const reportContext = dto.reportSummary
            ? `The following is extracted data from their medical report — use this to personalise guidance further (e.g. if Vitamin D is low, recommend D3; if HbA1c is high, recommend low-GI foods):\n${dto.reportSummary.slice(0, 1500)}`
            : 'No medical report available — base guidance on profile and conditions only.';
        const prompt = `You are a clinical nutritionist providing evidence-based personalised advice.

${forContext}
Health goal: ${dto.goal?.replace(/_/g, ' ')}
Diet type: ${dto.diet || 'not specified'}
Region / food culture: ${dto.region || 'not specified'}
${conditionsContext}

${reportContext}

Return ONLY a JSON object with this exact structure — no markdown, no explanation, no text before or after:
{
  "eat": ["food 1", "food 2", "food 3", "food 4", "food 5", "food 6"],
  "avoid": ["food 1", "food 2", "food 3", "food 4", "food 5"],
  "vitamins": ["supplement 1", "supplement 2", "supplement 3", "supplement 4"],
  "habits": ["habit 1", "habit 2", "habit 3", "habit 4", "habit 5"]
}

Rules:
- Tailor foods to their region (South Asian → dal, ragi, turmeric, idli, curd; not generic Western food)
- If conditions present, adapt accordingly (diabetes → low GI; hypertension → low sodium)
- If report data present, reference specific abnormal markers in recommendations
- Each item should be a specific, actionable sentence — not vague
- Return only valid JSON`;
        const response = await fetch(this.mistralUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.4,
                max_tokens: 900,
            }),
        });
        if (!response.ok) {
            const err = await response.text();
            throw new common_1.HttpException(`Mistral API error: ${err}`, response.status);
        }
        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content?.trim() || '';
        const clean = raw.replace(/^```json\n?|^```\n?|\n?```$/gm, '').trim();
        try {
            return JSON.parse(clean);
        }
        catch {
            throw new common_1.HttpException('Failed to parse AI response', 500);
        }
    }
};
exports.NutritionService = NutritionService;
exports.NutritionService = NutritionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NutritionService);
//# sourceMappingURL=nutrition.service.js.map