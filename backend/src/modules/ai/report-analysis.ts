export type Marker = { name: string; value: string; unit: string }

export type AnalysisResult = {
  riskScore: number
  summary: string
  recommendations: string[]
  findings: { label: string; status: 'high' | 'low' | 'normal'; value: string; note?: string }[]
}

const ranges: Record<string, { min?: number; max?: number; note?: string }> = {
  Hemoglobin: { min: 14, max: 18, note: 'Low hemoglobin may suggest anemia or iron/B12 issues.' },
  Platelets: { min: 150, max: 450 },
  WBC: { min: 4.8, max: 10.8 },
  Cholesterol: { max: 200, note: 'Total cholesterol above 200 mg/dL is elevated.' },
  'LDL Cholesterol': { max: 100, note: 'LDL should usually be kept under 100 mg/dL.' },
  'HDL Cholesterol': { min: 60, note: 'HDL below 60 mg/dL is considered low.' },
  Triglycerides: { max: 150 },
  'Vitamin D': { min: 30, note: 'Vitamin D below 30 ng/mL is low.' },
  'Vitamin B12': { min: 200, note: 'Vitamin B12 below 200 pg/mL is low.' },
  'hs-CRP': { max: 3, note: 'hs-CRP above 3 mg/L suggests higher inflammation.' },
}

const normalizeName = (name: string) => {
  const n = name.trim().toLowerCase()
  if (n.includes('hemoglobin')) return 'Hemoglobin'
  if (n.includes('platelet')) return 'Platelets'
  if (n === 'wbc' || n.includes('white blood cell')) return 'WBC'
  if (n === 'rbc' || n.includes('red blood cell')) return 'RBC'
  if (n.includes('ldl')) return 'LDL Cholesterol'
  if (n.includes('hdl')) return 'HDL Cholesterol'
  if (n.includes('cholesterol') && !n.includes('ldl') && !n.includes('hdl')) return 'Cholesterol'
  if (n.includes('triglycerides')) return 'Triglycerides'
  if (n.includes('vitamin d')) return 'Vitamin D'
  if (n.includes('vitamin b12') || n.includes('b12')) return 'Vitamin B12'
  if (n.includes('hs-crp') || n === 'crp') return 'hs-CRP'
  return name
}

export function analyzeMarkers(markers: Marker[]): AnalysisResult {
  const findings: AnalysisResult['findings'] = []
  let score = 20
  let highCount = 0
  let lowCount = 0

  for (const m of markers) {
    const name = normalizeName(m.name)
    const rule = ranges[name]
    const value = Number(m.value)
    if (Number.isNaN(value)) continue

    let status: 'high' | 'low' | 'normal' = 'normal'
    if (rule?.min !== undefined && value < rule.min) status = 'low'
    if (rule?.max !== undefined && value > rule.max) status = 'high'

    if (status === 'high') { score += 10; highCount += 1 }
    if (status === 'low') { score += 8; lowCount += 1 }

    findings.push({ label: name, status, value: `${m.value} ${m.unit}`.trim(), note: rule?.note })
  }

  score = Math.min(95, Math.max(5, score))

  const recommendations = [
    highCount ? 'Discuss elevated cardiovascular and inflammatory markers with a clinician.' : 'Continue regular preventive screening.' ,
    lowCount ? 'Review micronutrient status and consider lab-guided supplementation.' : 'Maintain balanced nutrition and hydration.',
    'Repeat key labs in 8–12 weeks if clinically advised.'
  ]

  const summary = highCount || lowCount
    ? `Detected ${highCount} high and ${lowCount} low markers. Focus on lipid control, micronutrient correction, and inflammation reduction.`
    : 'Markers are within expected range based on the available report.'

  return { riskScore: score, summary, recommendations, findings }
}

export function buildReportInsight(ocrText: string, markers: Marker[]) {
  const result = analyzeMarkers(markers)
  const text = ocrText.toLowerCase()

  if (text.includes('family history') || text.includes('hereditary')) {
    result.recommendations.push('Add family history module for hereditary risk stratification.')
  }

  return result
}