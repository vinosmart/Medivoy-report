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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mistralai_1 = require("@mistralai/mistralai");
const DNA_SYSTEM_PROMPT = `You are a DNA wellness analysis assistant.
Return ONLY valid JSON. No markdown. No prose outside JSON.
You must infer structured findings from the provided DNA text and markers.
If markers exist, you must create findings for them. Do not return empty findings when markers are present.
Use ONLY the provided text and markers. Do not rely on any static templates, defaults, or hardcoded outcomes.
Required JSON shape:
{
  "reportType": "dna",
  "overallHealthScore": number,
  "confidenceScore": number,
  "summary": string,
  "longTermInsights": [{ "horizonYears": number, "title": string, "outlook": "low"|"moderate"|"high", "insight": string }],
  "fiveYearAnswers": [{ "year": number, "question": string, "answer": string, "outlook": "low"|"moderate"|"high" }],
  "riskCategories": { [key: string]: number },
  "keyInsights": string[],
  "positiveFindings": string[],
  "criticalFindings": string[],
  "patternAnalysis": [{ "title": string, "severity": "low"|"moderate"|"high", "insight": string }],
  "recommendations": { "diet": string[], "exercise": string[], "sleep": string[], "supplements": string[], "followUp": string[] },
  "findings": [{ "label": string, "status": "normal"|"borderline"|"mild_high"|"moderate_high"|"critical_high"|"mild_low"|"critical_low", "value": string, "severityScore": number, "whyItMatters": string, "possibleCauses": string[], "recommendedActions": string[] }],
  "dnaTraits": [{ "trait": string, "result": string, "basedOn": string[], "insight": string }],
  "warnings": string[]
}
For fiveYearAnswers: generate 5 entries — one per year from year 1 to year 5.
Each entry must answer: "What should I focus on in year N based on my DNA profile?"
Be specific to the markers present. Cover cardiovascular, metabolic, micronutrient, and lifestyle dimensions across the 5 years.
For APOE E3/E4, discuss cardiovascular/LDL tendency.
For MTHFR C677T heterozygous, discuss folate metabolism support.
For FTO risk variant, discuss weight regulation tendency.
For HFE negative, mention no major HFE variant evidence.
For CYP1A2 slow metabolism variant present, mention caffeine sensitivity and slower metabolism.
For LCT lactase persistence variant absent, mention lactose intolerance possibility.
Do not fabricate numeric lab values. No empty arrays unless truly unsupported. Avoid medical diagnosis.`;
const BLOOD_SYSTEM_PROMPT = `You are a blood report analysis assistant.
Return ONLY valid JSON. No markdown. No prose outside JSON.
Use only the provided text and markers.
Required JSON shape:
{
  "reportType": "blood",
  "overallHealthScore": number,
  "confidenceScore": number,
  "summary": string,
  "longTermInsights": [{ "horizonYears": number, "title": string, "outlook": "low"|"moderate"|"high", "insight": string }],
  "fiveYearAnswers": [{ "year": number, "question": string, "answer": string, "outlook": "low"|"moderate"|"high" }],
  "riskCategories": { [key: string]: number },
  "keyInsights": string[],
  "positiveFindings": string[],
  "criticalFindings": string[],
  "missingImportantMarkers": string[],
  "patternAnalysis": [{ "title": string, "severity": "low"|"moderate"|"high", "insight": string }],
  "recommendations": { "diet": string[], "exercise": string[], "sleep": string[], "supplements": string[], "followUp": string[] },
  "findings": [{ "label": string, "status": "normal"|"borderline"|"mild_high"|"moderate_high"|"critical_high"|"mild_low"|"critical_low", "value": string, "severityScore": number, "whyItMatters": string, "possibleCauses": string[], "recommendedActions": string[] }],
  "warnings": string[]
}
For fiveYearAnswers: generate 5 entries — one per year from year 1 to year 5.
Each entry answers: "What health priority should I focus on in year N given these blood results?"
Be specific to the markers and findings present.
Do not fabricate numeric lab values. No empty arrays unless truly unsupported. Avoid medical diagnosis.`;
const OTHER_SYSTEM_PROMPT = `You are a clinical document analysis assistant.
Return ONLY valid JSON. No markdown. No prose outside JSON.
Analyze the provided report text and generate a useful structured summary.
Required JSON shape:
{
  "reportType": "other",
  "overallHealthScore": number,
  "confidenceScore": number,
  "summary": string,
  "longTermInsights": [{ "horizonYears": number, "title": string, "outlook": "low"|"moderate"|"high", "insight": string }],
  "fiveYearAnswers": [{ "year": number, "question": string, "answer": string, "outlook": "low"|"moderate"|"high" }],
  "riskCategories": { [key: string]: number },
  "keyInsights": string[],
  "positiveFindings": string[],
  "criticalFindings": string[],
  "patternAnalysis": [{ "title": string, "severity": "low"|"moderate"|"high", "insight": string }],
  "recommendations": { "diet": string[], "exercise": string[], "sleep": string[], "supplements": string[], "followUp": string[] },
  "findings": [{ "label": string, "status": "normal"|"borderline"|"mild_high"|"moderate_high"|"critical_high"|"mild_low"|"critical_low", "value": string, "severityScore": number, "whyItMatters": string, "possibleCauses": string[], "recommendedActions": string[] }],
  "warnings": string[]
}
For fiveYearAnswers: generate 5 entries — one per year — covering proactive steps based on this report.
No empty arrays unless truly unsupported. Avoid medical diagnosis.`;
let AiService = class AiService {
    constructor(configService) {
        this.configService = configService;
        this.mistral = null;
        const apiKey = this.configService.get('MISTRAL_API_KEY');
        if (apiKey)
            this.mistral = new mistralai_1.Mistral({ apiKey });
    }
    async analyzeReport(text, markers = [], type) {
        const normalizedText = this.normalizeText(text);
        const resolvedType = this.resolveReportType(String(type || '').toLowerCase(), normalizedText);
        if (resolvedType === 'blood')
            return this.analyzeBloodReport(normalizedText, markers);
        if (resolvedType === 'dna')
            return this.analyzeDnaReport(normalizedText, markers);
        return this.analyzeOtherReport(normalizedText, markers);
    }
    normalizeText(text) {
        let normalized = (text || '')
            .replace(/\r/g, '\n')
            .replace(/[|]/g, ' ')
            .replace(/[‐‑–—]/g, '-')
            .replace(/[“”]/g, '"')
            .replace(/[‘’]/g, "'")
            .replace(/\t/g, ' ')
            .replace(/ +/g, ' ');
        const anchors = [
            'Hemoglobin', 'Haemoglobin', 'WBC', 'RBC', 'Platelets', 'Neutrophils', 'Lymphocytes', 'Monocytes',
            'Eosinophils', 'Basophils', 'MCV', 'MCH', 'MCHC', 'RDW', 'Glucose', 'HbA1c', 'Cholesterol',
            'LDL', 'HDL', 'Triglycerides', 'AST', 'ALT', 'Bilirubin', 'Albumin', 'Total Protein', 'Creatinine',
            'Ferritin', 'Vitamin D', 'Vitamin B12', 'TSH', 'hs-CRP', 'APOE', 'MTHFR', 'FTO', 'HFE', 'CYP1A2', 'LCT'
        ];
        for (const anchor of anchors) {
            const re = new RegExp(`\\s(${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
            normalized = normalized.replace(re, '\n$1');
        }
        return normalized
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .join('\n');
    }
    resolveReportType(type, text) {
        const t = String(type || '').trim().toLowerCase();
        if (t === 'blood' || t === 'dna' || t === 'other')
            return t;
        const lower = text.toLowerCase();
        if (this.hasDnaSignals(lower))
            return 'dna';
        if (this.hasBloodSignals(lower))
            return 'blood';
        return 'other';
    }
    hasBloodSignals(text) {
        return [
            'cbc', 'hemoglobin', 'cholesterol', 'vitamin d', 'vitamin b12', 'hba1c', 'glucose', 'creatinine',
            'ferritin', 'lipid profile', 'platelets', 'wbc', 'rbc', 'monocytes', 'mch', 'mcv', 'alt', 'ast',
            'alkaline phosphatase', 'bilirubin', 'albumin', 'protein', 'ggtp', 'thyroid', 'tsh'
        ].some((t) => text.includes(t));
    }
    hasDnaSignals(text) {
        return [
            'apoe', 'mthfr', 'tcf7l2', 'vdr', 'fto', 'comt', 'actn3', 'ace', 'genotype', 'allele',
            'variant', 'heterozygous', 'homozygous', 'cyp1a2', 'lct', 'hfe'
        ].some((t) => text.includes(t));
    }
    async callAi(systemPrompt, payload, fallback) {
        if (!this.mistral)
            return fallback;
        try {
            const response = await this.mistral.chat.complete({
                model: 'mistral-large-latest',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: JSON.stringify(payload) },
                ],
                responseFormat: { type: 'json_object' },
            });
            const raw = response.choices?.[0]?.message?.content;
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (parsed && typeof parsed === 'object')
                return parsed;
        }
        catch (error) {
            console.error('AI call failed:', error);
        }
        return fallback;
    }
    emptyReport(reportType, message) {
        return {
            reportType,
            overallHealthScore: 50,
            confidenceScore: 0,
            summary: message,
            longTermInsights: [],
            fiveYearAnswers: [],
            riskCategories: {},
            keyInsights: [],
            positiveFindings: [],
            criticalFindings: [],
            missingImportantMarkers: [],
            patternAnalysis: [],
            recommendations: { diet: [], exercise: [], sleep: [], supplements: [], followUp: [] },
            findings: [],
            dnaTraits: [],
            warnings: ['Insufficient structured data detected.'],
        };
    }
    async analyzeBloodReport(text, markers) {
        if (!text.trim() && (!markers || markers.length === 0)) {
            return {
                ...this.emptyReport('blood', 'Insufficient data provided to analyze the blood report. No markers or text were available for interpretation.'),
                recommendations: {
                    diet: [],
                    exercise: [],
                    sleep: [],
                    supplements: [],
                    followUp: [
                        'Provide a complete blood report with markers for accurate analysis.',
                        'Consult a healthcare provider for a comprehensive evaluation.',
                    ],
                },
                missingImportantMarkers: ['Hemoglobin', 'WBC', 'RBC', 'Platelets'],
            };
        }
        const extractedMarkers = markers?.length ? markers : this.extractBloodMarkers(text);
        const ai = await this.callAi(BLOOD_SYSTEM_PROMPT, { reportType: 'blood', text, markers: extractedMarkers }, null);
        const fallbackFindings = this.buildBloodFallbackFindings(extractedMarkers);
        const findings = this.normalizeFindings(ai?.findings) ?? fallbackFindings;
        const recommendations = this.normalizeRecommendations(ai?.recommendations) ?? this.buildBloodRecommendations(findings);
        const longTermInsights = this.normalizeLongTermInsights(ai?.longTermInsights) ?? this.buildBloodLongTermInsights(findings);
        const fiveYearAnswers = this.normalizeFiveYearAnswers(ai?.fiveYearAnswers) ?? this.buildDefaultFiveYearAnswers('blood', findings);
        return {
            reportType: 'blood',
            overallHealthScore: this.coerceNumber(ai?.overallHealthScore, this.calculateWeightedHealthScore(findings)),
            confidenceScore: this.coerceNumber(ai?.confidenceScore, extractedMarkers.length ? 90 : 70),
            summary: this.getString(ai?.summary) || `Blood report analyzed with ${findings.length} findings.`,
            longTermInsights,
            fiveYearAnswers,
            riskCategories: this.normalizeRiskCategories(ai?.riskCategories) ?? this.calculateBloodCategoryScores(findings),
            keyInsights: this.normalizeStringArray(ai?.keyInsights) ?? this.buildBloodKeyInsights(findings),
            positiveFindings: this.normalizeStringArray(ai?.positiveFindings) ??
                findings.filter((f) => f.status === 'normal').slice(0, 5).map((f) => `${f.label} is within expected range.`),
            criticalFindings: this.normalizeStringArray(ai?.criticalFindings) ??
                findings.filter((f) => ['moderate_high', 'critical_high', 'critical_low', 'mild_low'].includes(f.status)).map((f) => `${f.label} requires attention.`),
            missingImportantMarkers: this.normalizeStringArray(ai?.missingImportantMarkers) ?? this.detectMissingMarkers(extractedMarkers),
            patternAnalysis: this.normalizePatternInsights(ai?.patternAnalysis) ?? this.detectBloodPatterns(findings),
            recommendations,
            findings,
            warnings: this.normalizeStringArray(ai?.warnings) ?? ['Blood insights are educational and not a medical diagnosis.'],
        };
    }
    extractBloodMarkers(text) {
        const aliases = {
            Hemoglobin: ['hemoglobin', 'haemoglobin'],
            WBC: ['white blood cell', 'wbc', 'total leucocyte count', 'tlc'],
            RBC: ['red blood cell', 'rbc'],
            Platelets: ['platelets', 'platelet count'],
            Neutrophils: ['neutrophils'],
            Lymphocytes: ['lymphocytes'],
            Monocytes: ['monocytes'],
            Eosinophils: ['eosinophils'],
            Basophils: ['basophils'],
            MCV: ['mcv'],
            MCH: ['mch'],
            MCHC: ['mchc'],
            RDW: ['rdw'],
            Glucose: ['fasting plasma glucose', 'glucose random', 'glucose', 'blood sugar'],
            HbA1c: ['hba1c'],
            Cholesterol: ['total cholesterol', 'cholesterol'],
            'LDL Cholesterol': ['ldl cholesterol', 'ldl'],
            'HDL Cholesterol': ['hdl cholesterol', 'hdl'],
            Triglycerides: ['triglycerides'],
            AST: ['ast', 'sgot'],
            ALT: ['alt', 'sgpt'],
            GGTP: ['ggtp', 'ggt'],
            'Alkaline Phosphatase': ['alkaline phosphatase', 'alp'],
            Bilirubin: ['bilirubin'],
            Albumin: ['albumin'],
            'Total Protein': ['total protein'],
            Creatinine: ['creatinine'],
            Ferritin: ['ferritin'],
            'Vitamin D': ['vitamin d'],
            'Vitamin B12': ['vitamin b12'],
            TSH: ['tsh'],
            'hs-CRP': ['hs-crp', 'crp'],
        };
        const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
        const markers = [];
        for (const [name, labels] of Object.entries(aliases)) {
            for (const line of lines) {
                if (this.isMetadataLine(line))
                    continue;
                const lower = line.toLowerCase();
                for (const label of labels) {
                    const idx = lower.indexOf(label);
                    if (idx === -1)
                        continue;
                    const tail = line.slice(idx + label.length);
                    const match = tail.match(/[:\s()\-]*([<>]?(?:\d+(?:\.\d+)?|not detected|reactive|non reactive|positive|negative))\s*([A-Za-z%/μ().-][A-Za-z0-9%/μ().-]*)?/i);
                    if (!match)
                        continue;
                    const value = this.getString(match[1]);
                    const unit = this.getString(match[2]);
                    if (!value)
                        continue;
                    if (value === '33' && unit.toLowerCase() === 'years')
                        continue;
                    markers.push({ name, value, unit: unit || undefined });
                    break;
                }
                if (markers.some((m) => m.name === name))
                    break;
            }
        }
        return this.uniqueMarkers(markers);
    }
    extractDnaMarkers(text) {
        const aliases = {
            APOE: ['apoe'],
            MTHFR: ['mthfr'],
            FTO: ['fto'],
            HFE: ['hfe'],
            CYP1A2: ['cyp1a2'],
            LCT: ['lct'],
            COMT: ['comt'],
            ACTN3: ['actn3'],
            ACE: ['ace'],
            VDR: ['vdr'],
            TCF7L2: ['tcf7l2'],
        };
        const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
        const markers = [];
        for (const [name, labels] of Object.entries(aliases)) {
            for (const line of lines) {
                if (this.isMetadataLine(line))
                    continue;
                const lower = line.toLowerCase();
                for (const label of labels) {
                    const idx = lower.indexOf(label);
                    if (idx === -1)
                        continue;
                    const tail = line.slice(idx + label.length).replace(/^[:\s-]+/, '').trim();
                    if (!tail)
                        continue;
                    const result = tail.split(/\s{2,}|\s(?=SUMMARY\b|NOTES\b|REPORT\b)/i)[0].trim();
                    if (!result)
                        continue;
                    markers.push({ name, value: result });
                    break;
                }
                if (markers.some((m) => m.name === name))
                    break;
            }
        }
        return this.uniqueMarkers(markers);
    }
    isMetadataLine(line) {
        const l = line.toLowerCase();
        return [
            'patient name', 'age', 'gender', 'date', 'report id', 'signature', 'doctor', 'specialist',
            'title', 'rx', 'processed by', 'sample collected', 'sample received', 'report released',
            'billing date', 'accession no', 'referring doctor', 'self referred', 'page no'
        ].some((x) => l.includes(x));
    }
    async analyzeDnaReport(text, markers = []) {
        const extractedMarkers = markers?.length ? markers : this.extractDnaMarkers(text);
        const ai = await this.callAi(DNA_SYSTEM_PROMPT, { reportType: 'dna', text, markers: extractedMarkers }, null);
        const fallbackTraits = this.buildDnaFallbackTraits(extractedMarkers);
        const fallbackFindings = this.buildDnaFallbackFindings(extractedMarkers);
        const findings = this.normalizeFindings(ai?.findings) ?? fallbackFindings;
        const traits = this.normalizeTraits(ai?.dnaTraits) ?? fallbackTraits;
        const longTerm = this.normalizeLongTermInsights(ai?.longTermInsights) ?? this.buildDnaLongTermInsights(extractedMarkers);
        const fiveYearAnswers = this.normalizeFiveYearAnswers(ai?.fiveYearAnswers) ?? this.buildDnaFiveYearAnswers(extractedMarkers);
        const recommendations = this.normalizeRecommendations(ai?.recommendations) ?? this.buildDnaRecommendations(extractedMarkers);
        return {
            reportType: 'dna',
            overallHealthScore: this.coerceNumber(ai?.overallHealthScore, extractedMarkers.length ? 72 : 60),
            confidenceScore: this.coerceNumber(ai?.confidenceScore, extractedMarkers.length ? 90 : 65),
            summary: this.getString(ai?.summary) || this.buildDnaSummary(extractedMarkers),
            longTermInsights: longTerm,
            fiveYearAnswers,
            riskCategories: this.normalizeRiskCategories(ai?.riskCategories) ?? this.buildDnaRiskCategories(extractedMarkers),
            keyInsights: this.normalizeStringArray(ai?.keyInsights) ?? this.buildDnaKeyInsights(extractedMarkers),
            positiveFindings: this.normalizeStringArray(ai?.positiveFindings) ?? this.buildDnaPositiveFindings(extractedMarkers),
            criticalFindings: this.normalizeStringArray(ai?.criticalFindings) ?? [],
            patternAnalysis: this.normalizePatternInsights(ai?.patternAnalysis) ?? this.buildDnaPatterns(extractedMarkers),
            recommendations,
            findings,
            dnaTraits: traits,
            warnings: this.normalizeStringArray(ai?.warnings) ?? ['DNA insights are wellness-focused and not disease diagnosis.'],
        };
    }
    async analyzeOtherReport(text, markers = []) {
        if (!text.trim() && (!markers || markers.length === 0)) {
            return this.emptyReport('other', 'Insufficient data provided to analyze the document.');
        }
        const ai = await this.callAi(OTHER_SYSTEM_PROMPT, { reportType: 'other', text, markers }, null);
        const fallback = this.buildOtherFallback(text);
        const fiveYearAnswers = this.normalizeFiveYearAnswers(ai?.fiveYearAnswers) ?? fallback.fiveYearAnswers;
        return {
            reportType: 'other',
            overallHealthScore: this.coerceNumber(ai?.overallHealthScore, fallback.overallHealthScore),
            confidenceScore: this.coerceNumber(ai?.confidenceScore, fallback.confidenceScore),
            summary: this.getString(ai?.summary) || fallback.summary,
            longTermInsights: this.normalizeLongTermInsights(ai?.longTermInsights) ?? fallback.longTermInsights,
            fiveYearAnswers,
            recommendations: this.normalizeRecommendations(ai?.recommendations) ?? fallback.recommendations,
            findings: this.normalizeFindings(ai?.findings) ?? fallback.findings,
            keyInsights: this.normalizeStringArray(ai?.keyInsights) ?? fallback.keyInsights,
            positiveFindings: this.normalizeStringArray(ai?.positiveFindings) ?? fallback.positiveFindings,
            criticalFindings: this.normalizeStringArray(ai?.criticalFindings) ?? fallback.criticalFindings,
            patternAnalysis: this.normalizePatternInsights(ai?.patternAnalysis) ?? fallback.patternAnalysis,
            riskCategories: this.normalizeRiskCategories(ai?.riskCategories) ?? fallback.riskCategories,
            warnings: this.normalizeStringArray(ai?.warnings) ?? fallback.warnings,
            dnaTraits: [],
            missingImportantMarkers: [],
        };
    }
    buildOtherFallback(text) {
        const lower = text.toLowerCase();
        const isLft = lower.includes('liver function') || lower.includes('lft') || lower.includes('liver panel');
        const hasBilirubin = lower.includes('bilirubin');
        const hasAltAst = lower.includes('ast') || lower.includes('alt') || lower.includes('sgot') || lower.includes('sgpt');
        const hasAlbumin = lower.includes('albumin');
        const findings = [];
        if (hasAltAst) {
            findings.push({
                label: 'Liver Enzymes',
                status: 'normal',
                value: 'AST/ALT mentioned in the report text',
                severityScore: 6,
                whyItMatters: 'Liver enzymes help assess liver cell irritation or injury.',
                possibleCauses: ['Routine liver function evaluation'],
                recommendedActions: ['Review exact values with a clinician.'],
            });
        }
        if (hasBilirubin) {
            findings.push({
                label: 'Bilirubin Panel',
                status: 'normal',
                value: 'Bilirubin mentioned in the report text',
                severityScore: 5,
                whyItMatters: 'Bilirubin helps evaluate liver and bile flow function.',
                possibleCauses: ['Routine liver panel'],
                recommendedActions: ['Correlate with the report\'s exact numeric values.'],
            });
        }
        if (hasAlbumin) {
            findings.push({
                label: 'Protein Markers',
                status: 'normal',
                value: 'Albumin or protein markers mentioned in the report text',
                severityScore: 5,
                whyItMatters: 'Protein markers help assess nutritional and liver-related context.',
                possibleCauses: ['Routine chemistry panel'],
                recommendedActions: ['Review exact values and reference ranges from the original report.'],
            });
        }
        return {
            reportType: 'other',
            overallHealthScore: 70,
            confidenceScore: text.trim() ? 75 : 0,
            summary: isLft
                ? 'Liver function style report detected with chemistry values and interpretive notes.'
                : 'Document analyzed with available text.',
            longTermInsights: [{ horizonYears: 1, title: 'Short-term review', outlook: 'low', insight: 'Follow-up depends on exact lab values and clinical context.' }],
            fiveYearAnswers: this.buildDefaultFiveYearAnswers('other', findings),
            recommendations: {
                diet: ['Follow a balanced diet if liver or metabolic support is needed.', 'Limit alcohol if advised.'],
                exercise: ['Maintain regular physical activity.'],
                sleep: ['Keep a stable sleep schedule.'],
                supplements: ['Use supplements only if prescribed.'],
                followUp: ['Review the report with a healthcare provider.', 'Confirm numeric values and reference ranges from the original PDF.'],
            },
            findings,
            keyInsights: ['Compatible with a non-DNA clinical document.', 'Interpretation depends on exact lab values and reference ranges.'],
            positiveFindings: ['The document includes interpretable clinical content.'],
            criticalFindings: [],
            missingImportantMarkers: [],
            patternAnalysis: [{ title: 'Report Type Pattern', severity: 'low', insight: 'This appears to be a general clinical or liver-related report with narrative comments.' }],
            riskCategories: { documentComplexity: 45, followUpNeed: 55 },
            dnaTraits: [],
            warnings: ['Analysis is best when the PDF text includes clearly extracted numeric results.'],
        };
    }
    buildDefaultFiveYearAnswers(reportType, findings) {
        if (reportType === 'blood') {
            return [
                { year: 1, question: 'What health priority should I focus on in year 1 given these blood results?', answer: 'Establish baseline habits: consistent diet, regular exercise, and repeat follow-up based on the abnormal markers.', outlook: 'low' },
                { year: 2, question: 'What health priority should I focus on in year 2 given these blood results?', answer: 'Review repeat lab trends and adjust diet or supplement plans based on the changes over time.', outlook: 'low' },
                { year: 3, question: 'What health priority should I focus on in year 3 given these blood results?', answer: 'Strengthen cardiovascular and metabolic health with consistent aerobic activity and stress management.', outlook: 'moderate' },
                { year: 4, question: 'What health priority should I focus on in year 4 given these blood results?', answer: 'Reassess micronutrient and inflammatory markers if they were previously abnormal or borderline.', outlook: 'low' },
                { year: 5, question: 'What health priority should I focus on in year 5 given these blood results?', answer: 'Conduct a comprehensive health review and compare long-term trends with a healthcare provider.', outlook: 'low' },
            ];
        }
        return [
            { year: 1, question: 'What should I focus on in Year 1?', answer: 'Establish baseline habits: consistent diet, regular exercise, and annual lab follow-up.', outlook: 'low' },
            { year: 2, question: 'What should I focus on in Year 2?', answer: 'Review your first-year labs and adjust diet or supplement plan based on the results.', outlook: 'low' },
            { year: 3, question: 'What should I focus on in Year 3?', answer: 'Strengthen cardiovascular and metabolic health with consistent aerobic activity and stress management.', outlook: 'moderate' },
            { year: 4, question: 'What should I focus on in Year 4?', answer: 'Reassess micronutrient levels and optimize supplementation accordingly.', outlook: 'low' },
            { year: 5, question: 'What should I focus on in Year 5?', answer: 'Conduct a comprehensive health review and compare multiple years of results.', outlook: 'low' },
        ];
    }
    buildBloodFallbackFindings(markers) {
        return markers.map((marker) => ({
            label: marker.name,
            status: 'normal',
            value: `${marker.value}${marker.unit ? ` ${marker.unit}` : ''}`.trim(),
            severityScore: 5,
            whyItMatters: 'This marker is part of the CBC or blood chemistry panel.',
            possibleCauses: ['Routine blood testing'],
            recommendedActions: ['Correlate with the reference range and clinical context.'],
        }));
    }
    buildBloodRecommendations(findings) {
        const rec = {
            diet: ['Eat mostly whole foods and fiber.'],
            exercise: ['Aim for regular weekly activity.'],
            sleep: ['Maintain consistent sleep.'],
            supplements: ['Discuss supplements with a healthcare provider.'],
            followUp: ['Repeat abnormal labs if advised.'],
        };
        if (findings.some((f) => ['mild_high', 'moderate_high', 'critical_high', 'mild_low', 'critical_low'].includes(f.status))) {
            rec.followUp.push('Track the abnormal markers over time.');
        }
        return rec;
    }
    buildBloodLongTermInsights(findings) {
        return findings.length
            ? [{ horizonYears: 1, title: 'Short-term blood outlook', outlook: 'low', insight: 'Most blood markers need trend-based interpretation with the exact reference ranges.' }]
            : [];
    }
    buildBloodKeyInsights(findings) {
        return findings.slice(0, 5).map((f) => `${f.label} was captured from the blood report.`);
    }
    detectBloodPatterns(findings) {
        const patterns = [];
        if (findings.some((f) => f.label === 'Hemoglobin') && findings.some((f) => f.label === 'RBC')) {
            patterns.push({ title: 'CBC Interpretation', severity: 'low', insight: 'Hemoglobin and RBC values should be reviewed together with the reference range.' });
        }
        if (findings.some((f) => ['LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides', 'Cholesterol'].includes(f.label))) {
            patterns.push({ title: 'Lipid Pattern', severity: 'moderate', insight: 'Lipid markers are present and should be interpreted together for cardiovascular context.' });
        }
        return patterns;
    }
    calculateBloodCategoryScores(findings) {
        return {
            bloodHealth: findings.length ? 70 : 50,
            followUpNeed: findings.length ? 55 : 80,
        };
    }
    calculateWeightedHealthScore(findings) {
        return Math.max(35, Math.min(95, 70 + Math.min(10, findings.length)));
    }
    buildDnaSummary(markers) {
        if (!markers.length)
            return 'DNA wellness analysis completed with limited structured information.';
        return `DNA wellness analysis completed with ${markers.length} extracted genetic markers.`;
    }
    buildDnaFallbackFindings(markers) {
        return markers.map((marker) => ({
            label: marker.name,
            status: this.getDnaStatus(marker),
            value: marker.value,
            severityScore: this.getDnaSeverity(marker),
            whyItMatters: this.getDnaWhy(marker),
            possibleCauses: ['Inherited genetic variation'],
            recommendedActions: this.getDnaActions(marker),
        }));
    }
    buildDnaFallbackTraits(markers) {
        return markers.map((marker) => ({
            trait: this.getDnaTraitLabel(marker.name),
            result: marker.value,
            basedOn: [marker.name],
            insight: this.getDnaInsight(marker),
        }));
    }
    buildDnaRecommendations(markers) {
        const names = new Set(markers.map((m) => m.name));
        const diet = ['Use a consistent whole-food eating pattern tailored to your genetic tendencies.'];
        const exercise = ['Maintain regular weekly exercise to support metabolic and cardiovascular resilience.'];
        const sleep = ['Keep a stable sleep routine to support recovery and long-term wellness habits.'];
        const supplements = ['Discuss any supplement decisions with a qualified healthcare professional.'];
        const followUp = ['Treat these DNA findings as wellness guidance rather than diagnosis.'];
        if (names.has('MTHFR'))
            diet.push('Ensure adequate natural folate intake from leafy greens, legumes, and fortified foods.');
        if (names.has('APOE'))
            diet.push('Pay extra attention to saturated fat quality and long-term cardiovascular nutrition patterns.');
        if (names.has('FTO'))
            exercise.push('Use structured exercise and portion consistency to support long-term weight regulation.');
        if (names.has('CYP1A2'))
            followUp.push('Monitor personal response to caffeine timing and dose.');
        if (names.has('LCT'))
            diet.push('Assess tolerance to dairy and consider lower-lactose alternatives if symptoms occur.');
        return { diet, exercise, sleep, supplements, followUp };
    }
    buildDnaKeyInsights(markers) {
        return markers.slice(0, 6).map((m) => `${m.name} was identified in the DNA report.`);
    }
    buildDnaPositiveFindings(markers) {
        return markers
            .filter((m) => /negative|absent|normal/i.test(m.value))
            .slice(0, 4)
            .map((m) => `${m.name} does not show a stronger risk-style result in this report.`);
    }
    buildDnaPatterns(markers) {
        const names = new Set(markers.map((m) => m.name));
        const patterns = [];
        if (names.has('APOE') || names.has('FTO')) {
            patterns.push({ title: 'Cardiometabolic Tendency Pattern', severity: 'moderate', insight: 'Some markers relate to long-term cardiovascular or weight-regulation tendencies.' });
        }
        if (names.has('MTHFR')) {
            patterns.push({ title: 'Micronutrient Support Pattern', severity: 'low', insight: 'Folate pathway support may be worth reviewing alongside diet quality.' });
        }
        if (names.has('CYP1A2') || names.has('LCT')) {
            patterns.push({ title: 'Lifestyle Response Pattern', severity: 'low', insight: 'Some markers affect how daily habits like caffeine or dairy may feel in practice.' });
        }
        return patterns;
    }
    buildDnaLongTermInsights(markers) {
        const insights = [];
        const names = new Set(markers.map((m) => m.name));
        if (names.has('APOE'))
            insights.push({ horizonYears: 5, title: 'Cardiovascular Outlook', outlook: 'moderate', insight: 'Cardiovascular habits and lipid monitoring may matter more over time given the APOE result.' });
        if (names.has('MTHFR'))
            insights.push({ horizonYears: 5, title: 'Micronutrient Outlook', outlook: 'low', insight: 'Folate-supportive nutrition may be useful as part of a long-term wellness strategy.' });
        if (names.has('FTO'))
            insights.push({ horizonYears: 10, title: 'Weight Regulation Outlook', outlook: 'moderate', insight: 'Structured diet and exercise habits may help offset weight-management tendency signals.' });
        if (!insights.length)
            insights.push({ horizonYears: 5, title: 'General Wellness Outlook', outlook: 'low', insight: 'DNA findings are best used as long-term lifestyle guidance rather than prediction.' });
        return insights;
    }
    buildDnaFiveYearAnswers(markers) {
        const names = new Set(markers.map((m) => m.name));
        return [
            {
                year: 1,
                question: 'What should I focus on in year 1 based on my DNA profile?',
                answer: names.has('APOE') ? 'Focus on cardiovascular-friendly eating patterns and establish a baseline lipid check routine.' : 'Establish baseline nutrition, movement, and sleep habits that you can sustain long term.',
                outlook: 'moderate',
            },
            {
                year: 2,
                question: 'What should I focus on in year 2 based on my DNA profile?',
                answer: names.has('MTHFR') ? 'Review folate-rich food intake and keep micronutrient support consistent.' : 'Refine nutrition based on how your body responds to the first year of habit changes.',
                outlook: 'low',
            },
            {
                year: 3,
                question: 'What should I focus on in year 3 based on my DNA profile?',
                answer: names.has('FTO') ? 'Prioritize weight-regulation habits with structured exercise, protein balance, and routine meal timing.' : 'Maintain strong metabolic habits through regular activity and body-composition awareness.',
                outlook: 'moderate',
            },
            {
                year: 4,
                question: 'What should I focus on in year 4 based on my DNA profile?',
                answer: names.has('CYP1A2') ? 'Reassess caffeine timing, dose, and sleep interaction to support recovery and focus.' : 'Review stimulant use, recovery quality, and consistency of daily routines.',
                outlook: 'low',
            },
            {
                year: 5,
                question: 'What should I focus on in year 5 based on my DNA profile?',
                answer: names.has('LCT') ? 'Review long-term digestive tolerance patterns, especially around dairy, and align your diet accordingly.' : 'Conduct a long-term lifestyle review and keep the most effective habits in place.',
                outlook: 'low',
            },
        ];
    }
    buildDnaRiskCategories(markers) {
        const names = new Set(markers.map((m) => m.name));
        const out = {};
        if (names.has('APOE'))
            out.cardiovascular = 70;
        if (names.has('FTO'))
            out.metabolic = 65;
        if (names.has('MTHFR'))
            out.micronutrient = 55;
        if (names.has('CYP1A2'))
            out.lifestyle_response = 50;
        if (names.has('LCT'))
            out.digestive_tolerance = 50;
        return out;
    }
    getDnaTraitLabel(name) {
        const map = {
            APOE: 'Cardiovascular lipid tendency',
            MTHFR: 'Folate metabolism support',
            FTO: 'Weight regulation tendency',
            HFE: 'Iron-overload variant screen',
            CYP1A2: 'Caffeine metabolism response',
            LCT: 'Lactose tolerance tendency',
            COMT: 'Stress and neurotransmitter response tendency',
            ACTN3: 'Muscle performance tendency',
            ACE: 'Endurance and blood pressure response tendency',
            VDR: 'Vitamin D response tendency',
            TCF7L2: 'Glucose regulation tendency',
        };
        return map[name] || `${name} trait`;
    }
    getDnaInsight(marker) {
        const value = marker.value.toLowerCase();
        switch (marker.name) {
            case 'APOE':
                return 'This marker can be relevant to long-term lipid handling and cardiovascular lifestyle planning.';
            case 'MTHFR':
                return 'This marker may be relevant to folate-pathway support and nutrition quality.';
            case 'FTO':
                return 'This marker is often discussed in the context of appetite, weight regulation, and metabolic habits.';
            case 'HFE':
                return value.includes('negative') ? 'This result does not suggest a major HFE variant in this report.' : 'This marker may be relevant to iron-handling context.';
            case 'CYP1A2':
                return 'This marker can influence caffeine sensitivity and how late-day caffeine feels.';
            case 'LCT':
                return 'This marker can relate to lactose tolerance and dairy symptom patterns.';
            default:
                return 'This marker contributes to a wellness-oriented interpretation of the DNA report.';
        }
    }
    getDnaWhy(marker) {
        return this.getDnaInsight(marker);
    }
    getDnaActions(marker) {
        switch (marker.name) {
            case 'APOE':
                return ['Focus on long-term heart-healthy eating patterns.', 'Discuss lipid monitoring with a clinician if relevant.'];
            case 'MTHFR':
                return ['Prioritize folate-rich foods.', 'Review micronutrient intake quality over time.'];
            case 'FTO':
                return ['Use consistent meal structure and regular exercise.', 'Monitor weight and waist trends over time.'];
            case 'HFE':
                return ['Interpret together with iron studies only when clinically needed.'];
            case 'CYP1A2':
                return ['Test lower caffeine intake and earlier caffeine timing.', 'Watch for sleep or anxiety effects.'];
            case 'LCT':
                return ['Observe whether dairy triggers symptoms.', 'Use lower-lactose options if needed.'];
            default:
                return ['Use this result as lifestyle guidance rather than diagnosis.'];
        }
    }
    getDnaStatus(marker) {
        const value = marker.value.toLowerCase();
        if (value.includes('risk variant present') || value.includes('slow metabolism'))
            return 'borderline';
        if (value.includes('absent') || value.includes('negative'))
            return 'normal';
        if (value.includes('heterozygous'))
            return 'borderline';
        return 'normal';
    }
    getDnaSeverity(marker) {
        const status = this.getDnaStatus(marker);
        if (status === 'borderline')
            return 35;
        return 10;
    }
    normalizeFiveYearAnswers(value) {
        if (!Array.isArray(value))
            return null;
        const items = value
            .map((v) => ({
            year: this.coerceNumber(v?.year, 1),
            question: this.getString(v?.question),
            answer: this.getString(v?.answer),
            outlook: this.normalizeOutlook(v?.outlook),
        }))
            .filter((v) => v.question && v.answer);
        return items.length ? items : null;
    }
    normalizeFindings(value) {
        if (!Array.isArray(value))
            return null;
        const items = value
            .map((v) => ({
            label: this.getString(v?.label),
            status: this.normalizeStatus(v?.status),
            value: this.getString(v?.value),
            severityScore: this.toNumber(v?.severityScore),
            note: this.getString(v?.note) || undefined,
            whyItMatters: this.getString(v?.whyItMatters) || undefined,
            possibleCauses: this.normalizeStringArray(v?.possibleCauses) || undefined,
            recommendedActions: this.normalizeStringArray(v?.recommendedActions) || undefined,
        }))
            .filter((v) => v.label && v.value);
        return items.length ? items : null;
    }
    normalizePatternInsights(value) {
        if (!Array.isArray(value))
            return null;
        const items = value
            .map((v) => ({
            title: this.getString(v?.title),
            severity: this.normalizePatternSeverity(v?.severity),
            insight: this.getString(v?.insight),
        }))
            .filter((v) => v.title && v.insight);
        return items.length ? items : null;
    }
    normalizeTraits(value) {
        if (!Array.isArray(value))
            return null;
        const items = value
            .map((v) => ({
            trait: this.getString(v?.trait),
            result: this.getString(v?.result),
            basedOn: this.normalizeStringArray(v?.basedOn) || [],
            insight: this.getString(v?.insight),
        }))
            .filter((v) => v.trait && v.result && v.insight);
        return items.length ? items : null;
    }
    normalizeLongTermInsights(value) {
        if (!Array.isArray(value))
            return null;
        const items = value
            .map((v) => ({
            horizonYears: this.coerceNumber(v?.horizonYears, 5),
            title: this.getString(v?.title),
            outlook: this.normalizeOutlook(v?.outlook),
            insight: this.getString(v?.insight),
        }))
            .filter((v) => v.title && v.insight);
        return items.length ? items : null;
    }
    normalizeRecommendations(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value))
            return null;
        return {
            diet: this.normalizeStringArray(value.diet) || [],
            exercise: this.normalizeStringArray(value.exercise) || [],
            sleep: this.normalizeStringArray(value.sleep) || [],
            supplements: this.normalizeStringArray(value.supplements) || [],
            followUp: this.normalizeStringArray(value.followUp) || [],
        };
    }
    normalizeRiskCategories(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value))
            return null;
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            const n = this.toNumber(v);
            if (k && Number.isFinite(n))
                out[k] = n;
        }
        return Object.keys(out).length ? out : null;
    }
    normalizeStringArray(value) {
        if (!Array.isArray(value))
            return null;
        const items = value.map((v) => this.getString(v)).filter(Boolean);
        return items.length ? items : null;
    }
    normalizeStatus(value) {
        const v = String(value || '').trim();
        return ['normal', 'borderline', 'mild_high', 'moderate_high', 'critical_high', 'mild_low', 'critical_low'].includes(v) ? v : 'normal';
    }
    normalizePatternSeverity(value) {
        const v = String(value || '').trim();
        return v === 'high' || v === 'moderate' || v === 'low' ? v : 'moderate';
    }
    normalizeOutlook(value) {
        const v = String(value || '').trim();
        return v === 'high' || v === 'moderate' || v === 'low' ? v : 'moderate';
    }
    getString(value) {
        return String(value ?? '').trim();
    }
    toNumber(value) {
        if (typeof value === 'number' && Number.isFinite(value))
            return value;
        const match = String(value ?? '').match(/\d+(?:\.\d+)?/);
        return match ? Number(match[0]) : NaN;
    }
    coerceNumber(value, fallback) {
        const n = this.toNumber(value);
        return Number.isFinite(n) ? n : fallback;
    }
    uniqueMarkers(markers) {
        const map = new Map();
        for (const marker of markers) {
            if (!map.has(marker.name))
                map.set(marker.name, marker);
        }
        return [...map.values()];
    }
    detectMissingMarkers(markers) {
        const importantMarkers = ['HbA1c', 'Ferritin', 'Vitamin D', 'Vitamin B12', 'hs-CRP'];
        return importantMarkers.filter((marker) => !markers.some((m) => m.name === marker));
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map