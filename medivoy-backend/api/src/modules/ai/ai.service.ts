import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Mistral } from '@mistralai/mistralai'

export type Marker = { name: string; value: string; unit?: string; referenceRange?: string }
export type FindingStatus = 'normal' | 'borderline' | 'mild_high' | 'moderate_high' | 'critical_high' | 'mild_low' | 'critical_low'
export type Finding = { label: string; status: FindingStatus; value: string; severityScore?: number; note?: string; whyItMatters?: string; possibleCauses?: string[]; recommendedActions?: string[] }
export type PatternInsight = { title: string; severity: 'low' | 'moderate' | 'high'; insight: string }
export type TraitInsight = { trait: string; result: string; basedOn: string[]; insight: string }
export type LongTermRiskInsight = { horizonYears: number; title: string; outlook: 'low' | 'moderate' | 'high'; insight: string }
export type FiveYearAnswer = { year: number; question: string; answer: string; outlook: 'low' | 'moderate' | 'high' }
export type AnalyzeResult = {
  reportType: 'blood' | 'dna' | 'other'
  overallHealthScore: number
  confidenceScore: number
  summary: string
  longTermInsights?: LongTermRiskInsight[]
  fiveYearAnswers?: FiveYearAnswer[]
  riskCategories?: Record<string, number>
  keyInsights?: string[]
  positiveFindings?: string[]
  criticalFindings?: string[]
  missingImportantMarkers?: string[]
  patternAnalysis?: PatternInsight[]
  recommendations: { diet: string[]; exercise: string[]; sleep: string[]; supplements: string[]; followUp: string[] }
  findings: Finding[]
  dnaTraits?: TraitInsight[]
  warnings?: string[]
}

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
Do not fabricate numeric lab values. No empty arrays unless truly unsupported. Avoid medical diagnosis.`

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
Do not fabricate numeric lab values. No empty arrays unless truly unsupported. Avoid medical diagnosis.`

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
No empty arrays unless truly unsupported. Avoid medical diagnosis.`

@Injectable()
export class AiService {
  private mistral: Mistral | null = null

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('MISTRAL_API_KEY')
    if (apiKey) this.mistral = new Mistral({ apiKey })
  }

  async analyzeReport(text: string, markers: Marker[] = [], type: string): Promise<AnalyzeResult> {
    const normalizedText = this.normalizeText(text)
    const resolvedType = this.resolveReportType(String(type || '').toLowerCase(), normalizedText)
    if (resolvedType === 'blood') return this.analyzeBloodReport(normalizedText, markers)
    if (resolvedType === 'dna') return this.analyzeDnaReport(normalizedText, markers)
    return this.analyzeOtherReport(normalizedText, markers)
  }

  private normalizeText(text: string) {
    return (text || '')
      .replace(/\r/g, '\n')
      .replace(/[|]/g, ' ')
      .replace(/[‐‑–—]/g, '-')
      .replace(/[""]/g, '"')
      .replace(/['']/g, "'")
      .replace(/\t/g, ' ')
      .replace(/ +/g, ' ')
  }

  private resolveReportType(type: string, text: string): 'blood' | 'dna' | 'other' {
    const lower = text.toLowerCase()
    if (type === 'blood') return 'blood'
    if (type === 'dna') return 'dna'
    if (this.hasDnaSignals(lower)) return 'dna'
    if (this.hasBloodSignals(lower)) return 'blood'
    return 'other'
  }

  private hasBloodSignals(text: string) {
    return ['cbc', 'hemoglobin', 'cholesterol', 'vitamin d', 'vitamin b12', 'hba1c', 'glucose', 'creatinine', 'ferritin', 'lipid profile', 'platelets', 'wbc', 'rbc', 'monocytes', 'mch', 'mcv', 'alt', 'ast', 'alkaline phosphatase', 'bilirubin', 'albumin', 'protein', 'ggtp'].some((t) => text.includes(t))
  }

  private hasDnaSignals(text: string) {
    return ['apoe', 'mthfr', 'tcf7l2', 'vdr', 'fto', 'comt', 'actn3', 'ace', 'genotype', 'allele', 'variant', 'heterozygous', 'homozygous'].some((t) => text.includes(t))
  }

  private async callAi(systemPrompt: string, payload: any, fallback: any) {
    if (!this.mistral) return fallback
    try {
      const response = await this.mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: JSON.stringify(payload) }],
        responseFormat: { type: 'json_object' },
      })
      const raw = response.choices?.[0]?.message?.content
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (parsed && typeof parsed === 'object') return parsed
    } catch (error) { console.error('AI call failed:', error) }
    return fallback
  }

  private emptyReport(reportType: 'blood' | 'dna' | 'other', message: string): AnalyzeResult {
    return {
      reportType, overallHealthScore: 50, confidenceScore: 0, summary: message,
      longTermInsights: [], fiveYearAnswers: [], riskCategories: {}, keyInsights: [],
      positiveFindings: [], criticalFindings: [], missingImportantMarkers: [],
      patternAnalysis: [], recommendations: { diet: [], exercise: [], sleep: [], supplements: [], followUp: [] },
      findings: [], warnings: ['Insufficient structured data detected.'],
    }
  }

  private async analyzeBloodReport(text: string, markers: Marker[]): Promise<AnalyzeResult> {
    if (!text.trim() && (!markers || markers.length === 0)) {
      return {
        ...this.emptyReport('blood', 'Insufficient data provided to analyze the blood report. No markers or text were available for interpretation.'),
        recommendations: { diet: [], exercise: [], sleep: [], supplements: [], followUp: ['Provide a complete blood report with markers for accurate analysis.', 'Consult a healthcare provider for a comprehensive evaluation.'] },
        missingImportantMarkers: ['Hemoglobin', 'WBC', 'RBC', 'Platelets'],
      }
    }
    const extractedMarkers = markers?.length ? markers : this.extractBloodMarkers(text)
    const ai = await this.callAi(BLOOD_SYSTEM_PROMPT, { reportType: 'blood', text, markers: extractedMarkers }, null)
    const fallbackFindings = this.buildBloodFallbackFindings(extractedMarkers)
    const findings = this.normalizeFindings(ai?.findings) ?? fallbackFindings
    const recommendations = this.normalizeRecommendations(ai?.recommendations) ?? this.buildBloodRecommendations(findings)
    const longTermInsights = this.normalizeLongTermInsights(ai?.longTermInsights) ?? this.buildBloodLongTermInsights(findings)
    const fiveYearAnswers = this.normalizeFiveYearAnswers(ai?.fiveYearAnswers) ?? this.buildDefaultFiveYearAnswers('blood', findings)
    return {
      reportType: 'blood',
      overallHealthScore: this.toNumber(ai?.overallHealthScore) ?? this.calculateWeightedHealthScore(findings),
      confidenceScore: this.toNumber(ai?.confidenceScore) ?? 90,
      summary: this.getString(ai?.summary) || `Blood report analyzed with ${findings.length} findings.`,
      longTermInsights, fiveYearAnswers,
      riskCategories: this.normalizeRiskCategories(ai?.riskCategories) ?? this.calculateBloodCategoryScores(findings),
      keyInsights: this.normalizeStringArray(ai?.keyInsights) ?? this.buildBloodKeyInsights(findings),
      positiveFindings: this.normalizeStringArray(ai?.positiveFindings) ?? findings.filter((f) => f.status === 'normal').slice(0, 5).map((f) => `${f.label} is within expected range.`),
      criticalFindings: this.normalizeStringArray(ai?.criticalFindings) ?? findings.filter((f) => ['moderate_high', 'critical_high', 'critical_low'].includes(f.status)).map((f) => `${f.label} requires attention.`),
      missingImportantMarkers: this.normalizeStringArray(ai?.missingImportantMarkers) ?? this.detectMissingMarkers(extractedMarkers),
      patternAnalysis: this.normalizePatternInsights(ai?.patternAnalysis) ?? this.detectBloodPatterns(findings),
      recommendations, findings,
      warnings: this.normalizeStringArray(ai?.warnings) ?? ['Blood insights are educational and not a medical diagnosis.'],
    }
  }

  private extractBloodMarkers(text: string): Marker[] {
    const aliases: Record<string, string[]> = {
      Hemoglobin: ['hemoglobin', 'haemoglobin'], WBC: ['wbc', 'white blood cell', 'total leucocyte count', 'tlc'],
      RBC: ['rbc', 'red blood cell'], Platelets: ['platelets', 'platelet count'], Neutrophils: ['neutrophils'],
      Lymphocytes: ['lymphocytes'], Monocytes: ['monocytes'], Eosinophils: ['eosinophils'], Basophils: ['basophils'],
      MCV: ['mcv'], MCH: ['mch'], MCHC: ['mchc'], RDW: ['rdw'], Glucose: ['glucose', 'blood sugar'], HbA1c: ['hba1c'],
      Cholesterol: ['cholesterol'], 'LDL Cholesterol': ['ldl'], 'HDL Cholesterol': ['hdl'], Triglycerides: ['triglycerides'],
      AST: ['ast', 'sgot'], ALT: ['alt', 'sgpt'], GGTP: ['ggtp', 'ggt'], 'Alkaline Phosphatase': ['alkaline phosphatase', 'alp'],
      Bilirubin: ['bilirubin'], Albumin: ['albumin'], 'Total Protein': ['total protein', 'protein'],
      Creatinine: ['creatinine'], Ferritin: ['ferritin'], 'Vitamin D': ['vitamin d'], 'Vitamin B12': ['vitamin b12'], TSH: ['tsh'],
    }
    const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
    const markers: Marker[] = []
    for (const [name, labels] of Object.entries(aliases)) {
      for (const line of lines) {
        const lower = line.toLowerCase()
        if (!labels.some((l) => lower.includes(l))) continue
        const match = line.match(/([<>]?[=]?\s*\d+(?:\.\d+)?(?:\s*[-–]\s*\d+(?:\.\d+)?)?)\s*([A-Za-z%/()0-9.-]+)?/)
        if (match) { markers.push({ name, value: match[1].replace(/\s+/g, ' ').trim(), unit: match[2] || '' }); break }
      }
    }
    return this.uniqueMarkers(markers)
  }

  private async analyzeDnaReport(text: string, markers: Marker[] = []): Promise<AnalyzeResult> {
    const ai = await this.callAi(DNA_SYSTEM_PROMPT, { reportType: 'dna', text, markers }, null)
    const findings = this.normalizeFindings(ai?.findings) ?? []
    const traits = this.normalizeTraits(ai?.dnaTraits) ?? []
    const longTerm = this.normalizeLongTermInsights(ai?.longTermInsights) ?? []
    const fiveYearAnswers = this.normalizeFiveYearAnswers(ai?.fiveYearAnswers) ?? this.buildDefaultFiveYearAnswers('dna', findings)
    const recommendations = this.normalizeRecommendations(ai?.recommendations) ?? { diet: [], exercise: [], sleep: [], supplements: [], followUp: [] }
    return {
      reportType: 'dna', overallHealthScore: this.toNumber(ai?.overallHealthScore) ?? 70, confidenceScore: this.toNumber(ai?.confidenceScore) ?? 90,
      summary: this.getString(ai?.summary) || 'DNA wellness analysis completed.',
      longTermInsights: longTerm, fiveYearAnswers,
      riskCategories: this.normalizeRiskCategories(ai?.riskCategories) ?? {},
      keyInsights: this.normalizeStringArray(ai?.keyInsights) ?? [],
      positiveFindings: this.normalizeStringArray(ai?.positiveFindings) ?? [],
      criticalFindings: this.normalizeStringArray(ai?.criticalFindings) ?? [],
      patternAnalysis: this.normalizePatternInsights(ai?.patternAnalysis) ?? [],
      recommendations, findings, dnaTraits: traits,
      warnings: this.normalizeStringArray(ai?.warnings) ?? ['DNA insights are wellness-focused and not disease diagnosis.'],
    }
  }

  private async analyzeOtherReport(text: string, markers: Marker[] = []): Promise<AnalyzeResult> {
    if (!text.trim() && (!markers || markers.length === 0)) {
      return this.emptyReport('other', 'Insufficient data provided to analyze the document.')
    }
    const ai = await this.callAi(OTHER_SYSTEM_PROMPT, { reportType: 'other', text, markers }, null)
    const fallback = this.buildOtherFallback(text)
    const fiveYearAnswers = this.normalizeFiveYearAnswers(ai?.fiveYearAnswers) ?? fallback.fiveYearAnswers
    return {
      reportType: 'other',
      overallHealthScore: this.toNumber(ai?.overallHealthScore) ?? fallback.overallHealthScore,
      confidenceScore: this.toNumber(ai?.confidenceScore) ?? fallback.confidenceScore,
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
    }
  }

  private buildOtherFallback(text: string): AnalyzeResult {
    const lower = text.toLowerCase()
    const isLft = lower.includes('liver function') || lower.includes('lft') || lower.includes('liver panel')
    const hasBilirubin = lower.includes('bilirubin')
    const hasAltAst = lower.includes('ast') || lower.includes('alt') || lower.includes('sgot') || lower.includes('sgpt')
    const findings: Finding[] = []
    if (hasAltAst) findings.push({ label: 'Liver Enzymes', status: 'normal', value: 'AST/ALT mentioned in the report text', severityScore: 6, whyItMatters: 'Liver enzymes help assess liver cell irritation or injury.', possibleCauses: ['Routine liver function evaluation'], recommendedActions: ['Review exact values with a clinician.'] })
    if (hasBilirubin) findings.push({ label: 'Bilirubin Panel', status: 'normal', value: 'Bilirubin mentioned in the report text', severityScore: 5, whyItMatters: 'Bilirubin helps evaluate liver and bile flow function.', possibleCauses: ['Routine liver panel'], recommendedActions: ['Correlate with the report\'s exact numeric values.'] })
    return {
      reportType: 'other', overallHealthScore: 70, confidenceScore: text.trim() ? 70 : 0,
      summary: isLft ? 'Liver function test report with liver enzymes, bilirubin, proteins, and interpretive notes.' : 'Document analyzed with available text.',
      longTermInsights: [{ horizonYears: 1, title: 'Short-term review', outlook: 'low', insight: 'Follow-up depends on exact lab values and clinical context.' }],
      fiveYearAnswers: this.buildDefaultFiveYearAnswers('other', findings),
      recommendations: { diet: ['Follow a balanced diet if liver health support is needed.', 'Limit alcohol if advised.'], exercise: ['Maintain regular physical activity.'], sleep: ['Keep a stable sleep schedule.'], supplements: ['Use supplements only if prescribed.'], followUp: ['Review the report with a healthcare provider.', 'Confirm numeric values and reference ranges from the original PDF.'] },
      findings, keyInsights: ['Compatible with a liver function report.', 'Interpretation depends on exact lab values and reference ranges.'],
      positiveFindings: ['The document includes interpretive notes from the laboratory.'],
      criticalFindings: [],
      patternAnalysis: [{ title: 'Report Type Pattern', severity: 'low', insight: 'This appears to be a liver panel/LFT report with narrative comments.' }],
      riskCategories: { liverHealth: 60, followUpNeed: 55 },
      warnings: ['Analysis is best when the PDF text includes clearly extracted numeric results.'],
    }
  }

  private buildDefaultFiveYearAnswers(reportType: string, findings: Finding[]): FiveYearAnswer[] {
    const base = [
      { year: 1, question: 'What should I focus on in Year 1?', answer: 'Establish baseline habits: consistent diet, regular exercise, and annual lab follow-up.', outlook: 'low' as const },
      { year: 2, question: 'What should I focus on in Year 2?', answer: 'Review your first-year labs and adjust diet or supplement plan based on the results.', outlook: 'low' as const },
      { year: 3, question: 'What should I focus on in Year 3?', answer: 'Strengthen cardiovascular and metabolic health with consistent aerobic activity and stress management.', outlook: 'moderate' as const },
      { year: 4, question: 'What should I focus on in Year 4?', answer: 'Reassess micronutrient levels (Vitamin D, B12, iron) and optimize supplementation accordingly.', outlook: 'low' as const },
      { year: 5, question: 'What should I focus on in Year 5?', answer: 'Conduct a comprehensive health review. Combine all prior reports for trend analysis with your healthcare provider.', outlook: 'low' as const },
    ]
    return base
  }

  private buildBloodFallbackFindings(markers: Marker[]): Finding[] {
    return markers.map((marker) => ({ label: marker.name, status: 'normal', value: `${marker.value}${marker.unit ? ` ${marker.unit}` : ''}`.trim(), severityScore: 5, whyItMatters: 'This marker is part of the CBC or blood chemistry panel.', possibleCauses: ['Routine blood testing'], recommendedActions: ['Correlate with the reference range and clinical context.'] }))
  }

  private buildBloodRecommendations(findings: Finding[]) {
    const rec = { diet: ['Eat mostly whole foods and fiber.'], exercise: ['Aim for regular weekly activity.'], sleep: ['Maintain consistent sleep.'], supplements: ['Discuss supplements with a healthcare provider.'], followUp: ['Repeat abnormal labs if advised.'] }
    if (findings.some((f) => ['mild_high', 'moderate_high', 'critical_high'].includes(f.status))) rec.followUp.push('Track the abnormal markers over time.')
    return rec
  }

  private buildBloodLongTermInsights(findings: Finding[]): LongTermRiskInsight[] {
    return findings.length ? [{ horizonYears: 1, title: 'Short-term blood outlook', outlook: 'low', insight: 'Most blood markers need trend-based interpretation with the exact reference ranges.' }] : []
  }

  private buildBloodKeyInsights(findings: Finding[]) { return findings.slice(0, 5).map((f) => `${f.label} was captured from the blood report.`) }
  private detectBloodPatterns(findings: Finding[]): PatternInsight[] {
    const patterns: PatternInsight[] = []
    if (findings.some((f) => f.label === 'Hemoglobin') && findings.some((f) => f.label === 'RBC')) patterns.push({ title: 'CBC Interpretation', severity: 'low', insight: 'Hemoglobin and RBC values should be reviewed together with the reference range.' })
    return patterns
  }

  private calculateBloodCategoryScores(findings: Finding[]) { return { bloodHealth: findings.length ? 70 : 50, followUpNeed: findings.length ? 55 : 80 } }
  private calculateWeightedHealthScore(findings: Finding[]) { return Math.max(35, Math.min(95, 70 + Math.min(10, findings.length))) }

  private normalizeFiveYearAnswers(value: any): FiveYearAnswer[] | null {
    if (!Array.isArray(value)) return null
    const items = value.map((v) => ({ year: this.toNumber(v?.year) || 1, question: this.getString(v?.question), answer: this.getString(v?.answer), outlook: this.normalizeOutlook(v?.outlook) })).filter((v) => v.question && v.answer)
    return items.length ? items : null
  }

  private normalizeFindings(value: any): Finding[] | null { if (!Array.isArray(value)) return null; const items = value.map((v) => ({ label: this.getString(v?.label), status: this.normalizeStatus(v?.status), value: this.getString(v?.value), severityScore: this.toNumber(v?.severityScore), note: this.getString(v?.note) || undefined, whyItMatters: this.getString(v?.whyItMatters) || undefined, possibleCauses: this.normalizeStringArray(v?.possibleCauses) || undefined, recommendedActions: this.normalizeStringArray(v?.recommendedActions) || undefined })).filter((v) => v.label && v.value); return items.length ? items : null }
  private normalizePatternInsights(value: any): PatternInsight[] | null { if (!Array.isArray(value)) return null; const items = value.map((v) => ({ title: this.getString(v?.title), severity: this.normalizePatternSeverity(v?.severity), insight: this.getString(v?.insight) })).filter((v) => v.title && v.insight); return items.length ? items : null }
  private normalizeTraits(value: any): TraitInsight[] | null { if (!Array.isArray(value)) return null; const items = value.map((v) => ({ trait: this.getString(v?.trait), result: this.getString(v?.result), basedOn: this.normalizeStringArray(v?.basedOn) || [], insight: this.getString(v?.insight) })).filter((v) => v.trait && v.result && v.insight); return items.length ? items : null }
  private normalizeLongTermInsights(value: any): LongTermRiskInsight[] | null { if (!Array.isArray(value)) return null; const items = value.map((v) => ({ horizonYears: this.toNumber(v?.horizonYears) || 5, title: this.getString(v?.title), outlook: this.normalizeOutlook(v?.outlook), insight: this.getString(v?.insight) })).filter((v) => v.title && v.insight); return items.length ? items : null }
  private normalizeRecommendations(value: any) { if (!value || typeof value !== 'object' || Array.isArray(value)) return null; return { diet: this.normalizeStringArray(value.diet) || [], exercise: this.normalizeStringArray(value.exercise) || [], sleep: this.normalizeStringArray(value.sleep) || [], supplements: this.normalizeStringArray(value.supplements) || [], followUp: this.normalizeStringArray(value.followUp) || [] } }
  private normalizeRiskCategories(value: any): Record<string, number> | null { if (!value || typeof value !== 'object' || Array.isArray(value)) return null; const out: Record<string, number> = {}; for (const [k, v] of Object.entries(value)) { const n = this.toNumber(v); if (k && Number.isFinite(n)) out[k] = n } return Object.keys(out).length ? out : null }
  private normalizeStringArray(value: any): string[] | null { if (!Array.isArray(value)) return null; const items = value.map((v) => this.getString(v)).filter(Boolean); return items.length ? items : null }
  private normalizeStatus(value: any): FindingStatus { const v = String(value || '').trim() as FindingStatus; return ['normal','borderline','mild_high','moderate_high','critical_high','mild_low','critical_low'].includes(v) ? v : 'normal' }
  private normalizePatternSeverity(value: any): PatternInsight['severity'] { const v = String(value || '').trim(); return v === 'high' || v === 'moderate' || v === 'low' ? v : 'moderate' }
  private normalizeOutlook(value: any): LongTermRiskInsight['outlook'] { const v = String(value || '').trim(); return v === 'high' || v === 'moderate' || v === 'low' ? v : 'moderate' }
  private getString(value: any) { return String(value ?? '').trim() }
  private toNumber(value: any) { if (typeof value === 'number' && Number.isFinite(value)) return value; const match = String(value ?? '').match(/\d+(?:\.\d+)?/); return match ? Number(match[0]) : NaN }
  private uniqueMarkers(markers: Marker[]) { const map = new Map<string, Marker>(); for (const marker of markers) if (!map.has(marker.name)) map.set(marker.name, marker); return [...map.values()] }
  private detectMissingMarkers(markers: Marker[]) { const importantMarkers = ['HbA1c', 'Ferritin', 'Vitamin D', 'Vitamin B12', 'hs-CRP']; return importantMarkers.filter((marker) => !markers.some((m) => m.name === marker)) }
}