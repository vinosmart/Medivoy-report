export type DnaMarker = { name: string; value: string; unit?: string }

export type DnaAnalysis = {
  riskScore: number
  summary: string
  recommendations: string[]
  findings: { label: string; status: 'high' | 'low' | 'normal'; value: string; note?: string }[]
}

const variantNotes: Record<string, string> = {
  APOE: 'APOE E4 can be associated with higher lipid and cardiovascular risk.',
  MTHFR: 'MTHFR variants may affect folate metabolism support needs.',
  FTO: 'FTO risk variants can be associated with weight gain tendency.',
  LCT: 'Lactase non-persistence can suggest lactose intolerance tendency.',
  HFE: 'HFE variants may relate to iron handling and need review if abnormal.',
  CYP1A2: 'Caffeine metabolism may be slower for some variants.',
}

function scoreVariant(name: string, value: string) {
  const v = value.toLowerCase()
  if (name === 'APOE') return v.includes('e4') ? 12 : 4
  if (name === 'MTHFR') return v.includes('heterozygous') ? 6 : v.includes('homozygous') ? 10 : 0
  if (name === 'FTO') return v.includes('risk') ? 8 : 0
  if (name === 'LCT') return v.includes('absent') ? 4 : 0
  if (name === 'HFE') return v.includes('positive') ? 8 : 0
  return 0
}

export function analyzeDna(markers: DnaMarker[]): DnaAnalysis {
  let riskScore = 20
  const findings: DnaAnalysis['findings'] = []
  const recs = new Set<string>()

  for (const m of markers) {
    const name = m.name.toUpperCase().trim()
    const value = String(m.value)
    let status: 'high' | 'low' | 'normal' = 'normal'
    const note = variantNotes[name]
    const add = scoreVariant(name, value)
    riskScore += add

    if (add >= 8) status = 'high'
    else if (add >= 4) status = 'low'

    findings.push({ label: name, status, value: [value, m.unit].filter(Boolean).join(' '), note })

    if (name === 'APOE' && value.toLowerCase().includes('e4')) recs.add('Use a heart-healthy, lower saturated-fat diet.')
    if (name === 'MTHFR') recs.add('Review folate, B12, and homocysteine-related nutrition support.')
    if (name === 'FTO') recs.add('Prioritize daily activity, protein-rich meals, and weight-management habits.')
    if (name === 'LCT') recs.add('Reduce lactose or use lactose-free alternatives if symptomatic.')
    if (name === 'HFE') recs.add('Review iron studies before taking iron supplements.')
    if (name === 'CYP1A2') recs.add('Moderate caffeine intake if sensitivity is present.')
  }

  riskScore = Math.min(90, Math.max(10, riskScore))
  const summary = findings.length
    ? 'Genetic profile shows actionable lifestyle and nutrition considerations.'
    : 'No actionable DNA markers detected in the current sample.'

  if (recs.size === 0) {
    recs.add('Maintain balanced nutrition, exercise, sleep, and periodic review.')
  }

  return { riskScore, summary, recommendations: [...recs], findings }
}