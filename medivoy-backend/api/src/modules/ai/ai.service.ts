import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Mistral } from '@mistralai/mistralai'

export type Marker = {
  name: string
  value: string
  unit?: string
  referenceRange?: string
}

type Finding = {
  label: string
  status: 'high' | 'low' | 'normal'
  value: string
  note?: string
}

type AnalyzeResult = {
  riskScore: number
  summary: string
  recommendations: string[]
  findings: Finding[]
}

@Injectable()
export class AiService {
  private mistral: Mistral | null = null

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('MISTRAL_API_KEY')
    if (apiKey) {
      this.mistral = new Mistral({ apiKey })
    }
  }

  async analyzeReport(text: string, markers: Marker[], type: string): Promise<AnalyzeResult> {
    const normalizedText = this.normalizeText(text)
    const requestedType = String(type || '').toLowerCase()
    const resolvedType = this.resolveReportType(requestedType, normalizedText)

    if (resolvedType === 'dna') {
      return this.analyzeDnaReport(normalizedText)
    }

    if (resolvedType === 'blood') {
      return this.analyzeBloodReport(normalizedText, markers)
    }

    const mistralOther = await this.analyzeOtherWithMistral(normalizedText)
    if (mistralOther && mistralOther.findings.length > 0) {
      return mistralOther
    }

    const otherFindings = this.extractOtherReportFindings(normalizedText)
    const riskScore = this.calculateOtherRiskScore(otherFindings)
    const fallbackSummary =
      otherFindings.length > 0
        ? `Detected ${otherFindings.length} useful items from this medical document.`
        : 'This appears to be a medical document, but only limited structured details could be extracted.'

    const fallbackRecommendations = this.buildOtherRecommendations(
      normalizedText,
      otherFindings,
    )

    return {
      riskScore,
      summary: fallbackSummary,
      recommendations: fallbackRecommendations,
      findings: otherFindings,
    }
  }

  private resolveReportType(type: string, text: string): 'blood' | 'dna' | 'other' {
    const lower = text.toLowerCase()

    if (type === 'dna') return 'dna'
    if (type === 'blood') return 'blood'
    if (type === 'other') {
      if (
        lower.includes('apoe') ||
        lower.includes('genotype') ||
        lower.includes('allele') ||
        lower.includes('genotyping') ||
        lower.includes('rs429358') ||
        lower.includes('rs7412') ||
        lower.includes('mthfr') ||
        lower.includes('cyp1a2') ||
        lower.includes('tcf7l2')
      ) {
        return 'dna'
      }
      return 'other'
    }

    if (
      lower.includes('apoe') ||
      lower.includes('genotype') ||
      lower.includes('allele') ||
      lower.includes('genotyping')
    ) {
      return 'dna'
    }

    if (
      lower.includes('hemoglobin') ||
      lower.includes('haemoglobin') ||
      lower.includes('wbc') ||
      lower.includes('platelets') ||
      lower.includes('cholesterol') ||
      lower.includes('triglycerides') ||
      lower.includes('vitamin b12') ||
      lower.includes('vitamin d')
    ) {
      return 'blood'
    }

    return 'other'
  }

  private async analyzeDnaReport(text: string): Promise<AnalyzeResult> {
    const dnaMode = this.detectDnaMode(text)

    if (dnaMode === 'forensic') {
      return {
        riskScore: 10,
        summary:
          'This appears to be a paternity or forensic DNA report, not a health genetics report.',
        recommendations: [
          'Health-risk interpretation is not supported for paternity or forensic DNA reports.',
          'Upload a wellness or health genetics DNA report for trait-based insights.',
        ],
        findings: [],
      }
    }

    const mistralDna = await this.analyzeDnaWithMistral(text)
    if (mistralDna && mistralDna.findings.length > 0) {
      return mistralDna
    }

    const dnaFindings = this.extractDnaFindings(text)
    const riskScore = this.calculateDnaRiskScore(dnaFindings)

    if (dnaFindings.length === 0) {
      return {
        riskScore: 20,
        summary:
          'This looks like a health DNA report, but no supported wellness variants were detected yet.',
        recommendations: [
          'Add variant parsers for APOE, MTHFR, FTO, CYP1A2, HFE, VDR, TCF7L2, LCT and COMT.',
          'Use the Genetics page for manual entry until automated DNA parsing is expanded.',
        ],
        findings: [],
      }
    }

    const fallbackSummary = `Detected ${dnaFindings.length} DNA-based health findings: ${dnaFindings
      .map((f) => f.label)
      .join(', ')}.`
    const fallbackRecommendations = this.buildDnaRecommendations(dnaFindings)
    const aiResult = await this.generateRecommendationsFromFindings(
      'dna',
      dnaFindings,
      fallbackSummary,
      fallbackRecommendations,
    )

    return {
      riskScore,
      summary: aiResult.summary || fallbackSummary,
      recommendations: aiResult.recommendations?.length
        ? aiResult.recommendations
        : fallbackRecommendations,
      findings: dnaFindings,
    }
  }

  private async analyzeBloodReport(text: string, markers: Marker[]): Promise<AnalyzeResult> {
    const extractedMarkers = markers?.length ? markers : this.extractBloodMarkers(text)
    const findings = this.buildBloodFindings(extractedMarkers)
    const riskScore = this.calculateBloodRiskScore(findings)

    if (findings.length === 0) {
      return {
        riskScore: 20,
        summary:
          'No standard health markers were detected in this report. Try uploading a blood panel or lab report.',
        recommendations: [
          'Continue regular preventive screening.',
          'Repeat key labs in 8–12 weeks if clinically advised.',
        ],
        findings: [],
      }
    }

    const elevatedCount = findings.filter((f) => f.status === 'high').length
    const lowCount = findings.filter((f) => f.status === 'low').length
    const abnormalLabels = findings
      .filter((f) => f.status !== 'normal')
      .map((f) => f.label)

    const fallbackSummary = abnormalLabels.length
      ? `Detected ${elevatedCount} elevated and ${lowCount} low markers. ${abnormalLabels.join(
          ', ',
        )} need attention.`
      : 'Markers were detected and are within the expected range.'

    const fallbackRecommendations = this.buildBloodRecommendations(findings)
    const aiResult = await this.generateRecommendationsFromFindings(
      'blood',
      findings,
      fallbackSummary,
      fallbackRecommendations,
    )

    return {
      riskScore,
      summary: aiResult.summary || fallbackSummary,
      recommendations: aiResult.recommendations?.length
        ? aiResult.recommendations
        : fallbackRecommendations,
      findings,
    }
  }

  private normalizeText(text: string) {
    return (text || '')
      .replace(/\r/g, '\n')
      .replace(/[|]/g, ' ')
      .replace(/[‐‑–—]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/\t/g, ' ')
      .replace(/ +/g, ' ')
  }

  private detectDnaMode(text: string): 'health' | 'forensic' {
    const forensicHints = [
      'paternity',
      'alleged father',
      'child',
      'mother',
      'cpi',
      'combined paternity index',
      'probability of paternity',
      'amelogenin',
      'd3s1358',
      'd8s1179',
      'fga',
      'vwa',
      'csf1po',
      'th01',
      'tpox',
      'd18s51',
      'd21s11',
    ]

    return forensicHints.some((term) => text.toLowerCase().includes(term))
      ? 'forensic'
      : 'health'
  }

  private async analyzeDnaWithMistral(text: string): Promise<AnalyzeResult | null> {
    if (!this.mistral || !text.trim()) return null

    try {
      const response = await this.mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content:
              'You are a genetics report analysis assistant. Return only valid JSON with keys: summary, recommendations, findings, riskScore. findings must be an array of objects with keys: label, status, value, note. Use only information present in the report text. If APOE genotype exists, include genotype and risk interpretation. status must be one of high, low, normal.',
          },
          {
            role: 'user',
            content: `
Analyze this genetics report and extract real findings.

Rules:
- Use only facts present in the text.
- Do not invent genes or diagnoses.
- Include genotype names and variant interpretation when available.
- recommendations must be short, practical, and general wellness follow-up suggestions.
- riskScore should be conservative and based only on explicit increased-risk wording.

Report text:
${text.slice(0, 15000)}
            `.trim(),
          },
        ],
        responseFormat: { type: 'json_object' },
      })

      const raw = response.choices?.[0]?.message?.content
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      const findings = this.sanitizeFindings(parsed?.findings)
      const recommendations = this.sanitizeRecommendations(parsed?.recommendations)

      return {
        riskScore:
          typeof parsed?.riskScore === 'number'
            ? Math.max(5, Math.min(100, parsed.riskScore))
            : this.calculateDnaRiskScore(findings),
        summary:
          typeof parsed?.summary === 'string' && parsed.summary.trim()
            ? parsed.summary.trim()
            : 'Genetic report analyzed.',
        recommendations: recommendations.length
          ? recommendations
          : this.buildDnaRecommendations(findings),
        findings,
      }
    } catch (error) {
      console.error('Mistral DNA analysis failed:', error)
      return null
    }
  }

  private extractDnaFindings(text: string): Finding[] {
    const findings: Finding[] = []
    const lower = text.toLowerCase()

    const pushIfFound = (
      label: string,
      regexes: RegExp[],
      status: 'high' | 'low' | 'normal',
      note: string,
      transform?: (match: RegExpMatchArray) => string,
    ) => {
      for (const regex of regexes) {
        const match = text.match(regex)
        if (match) {
          findings.push({
            label,
            status,
            value: transform ? transform(match) : (match[1] || '').trim(),
            note,
          })
          return
        }
      }
    }

    pushIfFound(
      'APOE',
      [
        /APOE[^\n:]*[:\-]\s*(e\d\/e\d|E\d\/E\d)/i,
        /APOE Alzheimer Disease Risk, Genotype\s*\n?\s*(e\d\/e\d|E\d\/E\d)/i,
      ],
      'high',
      'Associated with increased LDL and cardiovascular or neurodegenerative risk depending on context.',
    )

    pushIfFound(
      'MTHFR',
      [
        /MTHFR[^\n:]*[:\-]\s*(C677T(?:\s+heterozygous)?)/i,
        /MTHFR[^\n]*?(C677T)/i,
      ],
      'low',
      'Reduced folate metabolism; methylfolate may be preferred.',
    )

    if (lower.includes('fto')) {
      const match = text.match(/FTO[^\n:]*[:\-]\s*(AA|risk variant present)/i)
      findings.push({
        label: 'FTO',
        status: 'high',
        value: match?.[1]?.trim() || 'Risk variant present',
        note: 'Associated with increased obesity and appetite risk.',
      })
    }

    if (lower.includes('cyp1a2')) {
      const match = text.match(
        /CYP1A2[^\n:]*[:\-]\s*(slow metabolism variant present|slow metabol(?:ism|izer)?|AC|CC)/i,
      )
      findings.push({
        label: 'CYP1A2',
        status: 'high',
        value: match?.[1]?.trim() || 'Slow metabolism variant present',
        note: 'Associated with slower caffeine metabolism.',
      })
    }

    if (lower.includes('hfe')) {
      const match = text.match(/HFE[^\n:]*[:\-]\s*(H63D(?:\s+heterozygous|\s+carrier)?|negative)/i)
      findings.push({
        label: 'HFE',
        status: 'normal',
        value: match?.[1]?.trim() || 'H63D carrier',
        note: 'Monitor iron and ferritin levels periodically.',
      })
    }

    if (lower.includes('vdr')) {
      const match = text.match(/VDR[^\n:]*[:\-]\s*(low absorption|BsmI\s*[-—]?\s*bb genotype)/i)
      findings.push({
        label: 'VDR',
        status: 'low',
        value: match?.[1]?.trim() || 'Low absorption',
        note: 'Reduced Vitamin D absorption; supplementation may help.',
      })
    }

    if (lower.includes('tcf7l2')) {
      const match = text.match(/TCF7L2[^\n:]*[:\-]\s*(CT genotype|CT)/i)
      findings.push({
        label: 'TCF7L2',
        status: 'high',
        value: match?.[1]?.replace(/ genotype/i, '').trim() || 'CT',
        note: 'Associated with increased type 2 diabetes risk.',
      })
    }

    if (lower.includes('lct')) {
      const match = text.match(
        /LCT[^\n:]*[:\-]\s*(partial tolerance|lactase persistence variant absent|C\/T heterozygous)/i,
      )
      findings.push({
        label: 'LCT',
        status: 'low',
        value: match?.[1]?.trim() || 'Partial tolerance',
        note: 'May indicate partial lactase persistence or lactose sensitivity.',
      })
    }

    if (lower.includes('comt')) {
      const match = text.match(/COMT[^\n:]*[:\-]\s*([^\n]+)/i)
      findings.push({
        label: 'COMT',
        status: 'normal',
        value: match?.[1]?.trim() || 'Variant detected',
        note: 'COMT may influence stress response and catecholamine metabolism.',
      })
    }

    if (lower.includes('alzheimer')) {
      findings.push({
        label: 'Alzheimer risk context',
        status: 'high',
        value: 'Present',
        note: 'The report mentions increased Alzheimer disease risk context.',
      })
    }

    return this.uniqueFindings(findings)
  }

  private extractBloodMarkers(text: string): Marker[] {
    const aliases: Record<string, string[]> = {
      WBC: ['white blood cell', 'wbc', 'total leucocyte count', 'tlc'],
      RBC: ['red blood cell', 'rbc'],
      Hemoglobin: ['hemoglobin', 'haemoglobin', 'hb', 'hgb'],
      Hematocrit: ['hematocrit', 'pcv', 'hct'],
      Platelets: ['platelets', 'platelet count'],
      Cholesterol: ['total cholesterol', 'cholesterol'],
      'LDL Cholesterol': ['ldl cholesterol', 'ldl'],
      'HDL Cholesterol': ['hdl cholesterol', 'hdl'],
      Triglycerides: ['triglycerides', 'triglyceride', 'tg'],
      Glucose: ['glucose', 'fasting glucose', 'blood sugar', 'fbs', 'fasting blood sugar'],
      'Vitamin D': ['vitamin d', '25-oh vitamin d', '25 hydroxy vitamin d'],
      'Vitamin B12': ['vitamin b12', 'b12'],
      'hs-CRP': ['hs-crp', 'hs crp', 'crp'],
    }

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const markers: Marker[] = []

    for (const [name, possibleLabels] of Object.entries(aliases)) {
      for (const line of lines) {
        const normalizedLine = line.toLowerCase()
        if (!possibleLabels.some((label) => normalizedLine.includes(label))) {
          continue
        }

        const match = line.match(/[:\-]\s*([<>]?[=]?\s*\d+(?:\.\d+)?)\s*([A-Za-z%/0-9.-]+)/)
        if (match) {
          markers.push({
            name,
            value: match[1].replace(/\s+/g, ''),
            unit: match[2],
          })
          break
        }

        const looseMatch = line.match(/\b(\d+(?:\.\d+)?)\s*([A-Za-z%/0-9.-]+)/)
        if (looseMatch) {
          markers.push({
            name,
            value: looseMatch[1],
            unit: looseMatch[2],
          })
          break
        }
      }
    }

    return this.uniqueMarkers(markers)
  }

  private buildBloodFindings(markers: Marker[]): Finding[] {
    return markers.map((marker) => {
      const numericValue = this.toNumber(marker.value)
      const value = `${marker.value} ${marker.unit || ''}`.trim()

      switch (marker.name) {
        case 'WBC':
          return this.makeFinding(marker.name, numericValue, value, 4.0, 11.0)
        case 'RBC':
          return this.makeFinding(marker.name, numericValue, value, 4.5, 6.0)
        case 'Hemoglobin':
          return this.makeFinding(
            marker.name,
            numericValue,
            value,
            13.5,
            17.5,
            'Low hemoglobin may suggest anaemia or iron/B12 deficiency.',
          )
        case 'Hematocrit':
          return this.makeFinding(marker.name, numericValue, value, 40, 52)
        case 'Platelets':
          return this.makeFinding(marker.name, numericValue, value, 150, 450)
        case 'Cholesterol':
          return this.makeFinding(
            marker.name,
            numericValue,
            value,
            0,
            200,
            undefined,
            'Total cholesterol above 200 mg/dL is elevated.',
          )
        case 'LDL Cholesterol':
          return this.makeFinding(
            marker.name,
            numericValue,
            value,
            0,
            100,
            undefined,
            'LDL should be kept under 100 mg/dL.',
          )
        case 'HDL Cholesterol':
          return this.makeFinding(
            marker.name,
            numericValue,
            value,
            60,
            1000,
            'HDL below 60 mg/dL is considered low.',
          )
        case 'Triglycerides':
          return this.makeFinding(marker.name, numericValue, value, 0, 150)
        case 'Glucose':
          return this.makeFinding(marker.name, numericValue, value, 70, 99)
        case 'Vitamin D':
          return this.makeFinding(
            marker.name,
            numericValue,
            value,
            30,
            100,
            'Vitamin D below 30 ng/mL is insufficient.',
          )
        case 'Vitamin B12':
          return this.makeFinding(
            marker.name,
            numericValue,
            value,
            200,
            900,
            'Vitamin B12 below 200 pg/mL is low.',
          )
        case 'hs-CRP':
          return this.makeFinding(
            marker.name,
            numericValue,
            value,
            0,
            3,
            undefined,
            'hs-CRP above 3 mg/L suggests elevated inflammation.',
          )
        default:
          return { label: marker.name, status: 'normal', value }
      }
    })
  }

  private async analyzeOtherWithMistral(text: string): Promise<AnalyzeResult | null> {
    if (!this.mistral || !text.trim()) return null

    try {
      const response = await this.mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content:
              'You are a medical document analysis assistant. Return only valid JSON with keys: documentType, summary, recommendations, findings, riskScore. findings must be an array of objects with keys: label, status, value, note. Extract real information from the report text. Do not invent facts. status must be one of high, low, normal.',
          },
          {
            role: 'user',
            content: `
Analyze this medical document and extract the real findings.

Rules:
- Use only the information present in the text.
- Prefer clinically meaningful findings over generic categories.
- If the report contains genotype or allele information, include it explicitly.
- recommendations must be short, practical, and generic, not prescriptions.
- riskScore should be conservative and based only on clearly stated elevated risk language in the report.

Document text:
${text.slice(0, 15000)}
            `.trim(),
          },
        ],
        responseFormat: { type: 'json_object' },
      })

      const raw = response.choices?.[0]?.message?.content
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      const findings = this.sanitizeFindings(parsed?.findings)
      const recommendations = this.sanitizeRecommendations(parsed?.recommendations)

      return {
        riskScore:
          typeof parsed?.riskScore === 'number'
            ? Math.max(5, Math.min(100, parsed.riskScore))
            : this.calculateOtherRiskScore(findings),
        summary:
          typeof parsed?.summary === 'string' && parsed.summary.trim()
            ? parsed.summary.trim()
            : 'Medical document analyzed.',
        recommendations: recommendations.length
          ? recommendations
          : this.buildOtherRecommendations(text, findings),
        findings,
      }
    } catch (error) {
      console.error('Mistral other-report analysis failed:', error)
      return null
    }
  }

  private extractOtherReportFindings(text: string): Finding[] {
    const findings: Finding[] = []
    const lower = text.toLowerCase()

    const keywordGroups = [
      {
        label: 'Diagnosis',
        patterns: ['diagnosis', 'diagnosed with', 'impression', 'assessment'],
        note: 'A diagnosis or clinical impression is mentioned in this document.',
      },
      {
        label: 'Treatment',
        patterns: ['treatment', 'treated with', 'therapy', 'management plan'],
        note: 'Treatment details are mentioned.',
      },
      {
        label: 'Medication',
        patterns: ['tablet', 'capsule', 'mg', 'medicine', 'medication', 'prescribed'],
        note: 'Medication or prescription details are present.',
      },
      {
        label: 'Procedure',
        patterns: ['procedure', 'surgery', 'operative', 'biopsy', 'scan', 'mri', 'ct', 'ultrasound'],
        note: 'A procedure or imaging study is mentioned.',
      },
      {
        label: 'Follow-up',
        patterns: ['follow up', 'follow-up', 'review after', 'review in', 'next visit', 'revisit'],
        note: 'Follow-up advice is present.',
      },
      {
        label: 'Advice',
        patterns: ['advice', 'recommended', 'instructions', 'lifestyle', 'diet'],
        note: 'General advice or care instructions are included.',
      },
    ]

    for (const group of keywordGroups) {
      if (group.patterns.some((p) => lower.includes(p))) {
        findings.push({
          label: group.label,
          status: 'normal',
          value: 'Detected',
          note: group.note,
        })
      }
    }

    return this.uniqueFindings(findings)
  }

  private makeFinding(
    label: string,
    numericValue: number,
    value: string,
    min: number,
    max: number,
    lowNote?: string,
    highNote?: string,
  ): Finding {
    if (Number.isNaN(numericValue)) {
      return { label, status: 'normal', value }
    }

    if (numericValue < min) {
      return {
        label,
        status: 'low',
        value,
        note: lowNote,
      }
    }

    if (numericValue > max) {
      return {
        label,
        status: 'high',
        value,
        note: highNote,
      }
    }

    return { label, status: 'normal', value }
  }

  private calculateBloodRiskScore(findings: Finding[]) {
    let score = 20
    for (const finding of findings) {
      if (finding.status === 'high') score += 12
      if (finding.status === 'low') score += 8
    }
    return Math.min(score, 100)
  }

  private calculateDnaRiskScore(findings: Finding[]) {
    let score = 20
    for (const finding of findings) {
      if (finding.status === 'high') score += 15
      if (finding.status === 'low') score += 8
      if (finding.status === 'normal') score += 3
    }
    return Math.min(score, 100)
  }

  private calculateOtherRiskScore(findings: Finding[]) {
    if (!findings.length) return 15
    return Math.min(40, 15 + findings.length * 4)
  }

  private buildBloodRecommendations(findings: Finding[]) {
    const recommendations = [
      findings.some((f) => f.label === 'Hemoglobin' && f.status === 'low')
        ? 'Increase iron-rich foods (spinach, lentils, red meat) and check for B12/folate.'
        : '',
      findings.some((f) => f.label === 'Cholesterol' && f.status === 'high') ||
      findings.some((f) => f.label === 'LDL Cholesterol' && f.status === 'high')
        ? 'Reduce saturated fat, increase fibre and omega-3 intake.'
        : '',
      findings.some((f) => f.label === 'Vitamin D' && f.status === 'low')
        ? 'Supplement with Vitamin D3 (1000–2000 IU/day) and increase sun exposure.'
        : '',
      findings.some((f) => f.label === 'Vitamin B12' && f.status === 'low')
        ? 'Start Vitamin B12 supplementation or increase dairy/meat intake.'
        : '',
      findings.some((f) => f.label === 'hs-CRP' && f.status === 'high')
        ? 'Reduce processed foods, increase anti-inflammatory foods (turmeric, berries, fish).'
        : '',
      findings.some((f) => f.status === 'high')
        ? 'Discuss elevated markers with a clinician promptly.'
        : '',
      findings.some((f) => f.status === 'low')
        ? 'Review micronutrient deficiencies and consider supplementation.'
        : '',
      'Repeat key labs in 8–12 weeks if clinically advised.',
    ].filter(Boolean)

    return recommendations.length
      ? recommendations
      : ['Continue regular preventive screening.']
  }

  private buildDnaRecommendations(findings: Finding[]) {
    const recommendations = [
      findings.some((f) => f.label === 'APOE')
        ? 'Review the APOE result with a clinician or genetics counselor in the right clinical context.'
        : '',
      findings.some((f) => f.label === 'Alzheimer risk context')
        ? 'Do not interpret APOE status alone as a diagnosis; combine it with clinical evaluation.'
        : '',
      findings.some((f) => f.label === 'MTHFR')
        ? 'Prefer methylfolate and methylcobalamin over standard folic acid supplements.'
        : '',
      findings.some((f) => f.label === 'FTO')
        ? 'Focus on portion control, protein-rich meals, and regular exercise.'
        : '',
      findings.some((f) => f.label === 'CYP1A2')
        ? 'Limit caffeine intake, especially late in the day.'
        : '',
      findings.some((f) => f.label === 'VDR')
        ? 'Check Vitamin D levels and consider D3 supplementation.'
        : '',
      findings.some((f) => f.label === 'HFE')
        ? 'Monitor ferritin and iron studies periodically.'
        : '',
      findings.some((f) => f.label === 'TCF7L2')
        ? 'Monitor HbA1c and fasting glucose regularly and reduce refined carbohydrates.'
        : '',
    ].filter(Boolean)

    return recommendations.length
      ? recommendations
      : ['Use the Genetics page for manual review until more DNA variants are supported.']
  }

  private buildOtherRecommendations(text: string, findings: Finding[]) {
    const lower = text.toLowerCase()

    const recommendations = [
      findings.some((f) => f.label === 'Medication')
        ? 'Review prescribed medicines with a clinician or pharmacist before making changes.'
        : '',
      findings.some((f) => f.label === 'Follow-up')
        ? 'Keep the recommended follow-up appointment and carry prior reports for comparison.'
        : '',
      findings.some((f) => f.label === 'Procedure')
        ? 'Store this procedure or imaging report with related clinical notes for future review.'
        : '',
      lower.includes('diet') || lower.includes('lifestyle')
        ? 'Follow the lifestyle and diet instructions mentioned in the report consistently.'
        : '',
      'Consult the treating clinician for interpretation in the context of symptoms and medical history.',
    ].filter(Boolean)

    return recommendations.length
      ? recommendations
      : ['Keep this document for clinical follow-up and future comparison.']
  }

  private async generateRecommendationsFromFindings(
    type: string,
    findings: Finding[],
    fallbackSummary: string,
    fallbackRecommendations: string[],
  ): Promise<{ summary: string; recommendations: string[] }> {
    if (!this.mistral || findings.length === 0) {
      return {
        summary: fallbackSummary,
        recommendations: fallbackRecommendations,
      }
    }

    try {
      const response = await this.mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content:
              'You are a health report assistant. Return only valid JSON with keys: summary and recommendations. recommendations must be an array of short, generic wellness suggestions. Do not provide diagnosis, emergency advice, or drug prescriptions.',
          },
          {
            role: 'user',
            content: JSON.stringify({ type, findings }),
          },
        ],
        responseFormat: { type: 'json_object' },
      })

      const raw = response.choices?.[0]?.message?.content
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      const recommendations = this.sanitizeRecommendations(parsed?.recommendations)

      return {
        summary:
          typeof parsed?.summary === 'string' && parsed.summary.trim()
            ? parsed.summary.trim()
            : fallbackSummary,
        recommendations: recommendations.length ? recommendations : fallbackRecommendations,
      }
    } catch (error) {
      console.error('Mistral recommendation generation failed:', error)
      return {
        summary: fallbackSummary,
        recommendations: fallbackRecommendations,
      }
    }
  }

  private sanitizeFindings(value: unknown): Finding[] {
    if (!Array.isArray(value)) return []

    return value
      .filter((item: any) => item && typeof item.label === 'string' && typeof item.value === 'string')
      .map((item: any) => ({
        label: String(item.label).trim(),
        value: String(item.value).trim(),
        status:
          item.status === 'high' || item.status === 'low' || item.status === 'normal'
            ? item.status
            : 'normal',
        note: typeof item.note === 'string' ? item.note.trim() : undefined,
      }))
      .filter((item) => item.label && item.value)
  }

  private sanitizeRecommendations(value: unknown): string[] {
    if (!Array.isArray(value)) return []
    return value
      .filter((item: unknown) => typeof item === 'string')
      .map((item: string) => item.trim())
      .filter(Boolean)
  }

  private uniqueMarkers(markers: Marker[]) {
    const map = new Map<string, Marker>()
    for (const marker of markers) {
      if (!map.has(marker.name)) {
        map.set(marker.name, marker)
      }
    }
    return [...map.values()]
  }

  private uniqueFindings(findings: Finding[]) {
    const map = new Map<string, Finding>()
    for (const finding of findings) {
      if (!map.has(finding.label)) {
        map.set(finding.label, finding)
      }
    }
    return [...map.values()]
  }

  private toNumber(value: string) {
    const match = String(value || '').match(/\d+(?:\.\d+)?/)
    return match ? Number(match[0]) : NaN
  }
}