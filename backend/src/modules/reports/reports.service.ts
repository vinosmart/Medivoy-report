import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Report } from './entities/report.entity'
import { AiService, Marker } from '../ai/ai.service'
import { UnlimitedOcrService } from '../unlimited-ocr/unlimited-ocr.service'
import * as fs from 'fs'
import * as path from 'path'
import { createWorker } from 'tesseract.js'
import * as pdfParse from 'pdf-parse'

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private repo: Repository<Report>,
    private aiService: AiService,
    private unlimitedOcr: UnlimitedOcrService,
  ) {}

  async create(
    userId: string,
    title: string,
    type: string,
    fileUrl: string,
    forMember: string = '',
    filePath?: string,
  ) {
    const report = this.repo.create({
      userId,
      title,
      type,
      fileUrl,
      forMember: forMember || '',
      status: 'processing',
    })

    const saved = await this.repo.save(report)

    this.processReport(saved.id, filePath || '', type).catch((err) =>
      console.error('processReport failed:', err),
    )

    return saved
  }

  private async processReport(reportId: string, filePath: string, type: string) {
    try {
      let extractedText = ''

      if (filePath && fs.existsSync(filePath)) {
        extractedText = await this.extractTextFromFile(filePath)
      }

      if (!extractedText || extractedText.trim().length < 20) {
        const fallback = await this.readFallbackText(reportId, filePath)
        if (fallback) extractedText = fallback
      }

      const normalizedType = this.aiService.detectReportType(String(type || ''), extractedText)

      console.log('[processReport] reportId:', reportId)
      console.log('[processReport] filePath:', filePath)
      console.log('[processReport] type:', normalizedType)
      console.log('[processReport] extractedText length:', extractedText?.length || 0)

      let markers =
        normalizedType === 'dna'
          ? this.extractDnaFindingsAsMarkers(extractedText)
          : normalizedType === 'blood'
            ? this.extractBloodMarkersFromText(extractedText)
            : []

      // Lab layouts vary too much for the regex extractor; prefer the AI's
      // structured extraction when it finds more results.
      if (normalizedType === 'blood') {
        const aiMarkers = await this.aiService.extractLabMarkers(extractedText)
        if (aiMarkers.length > markers.length) markers = aiMarkers
      }

      console.log('[processReport] markers length:', markers.length)

      const result = await this.aiService.analyzeReport(extractedText, markers, normalizedType)

      const fallbackMarkers =
        markers.length > 0
          ? markers
          : result.findings?.map((f) => ({
              name: f.label,
              value: f.value,
              unit: '',
            })) || []

      const updatePayload: Partial<Report> & Record<string, any> = {
        status: 'done',
        riskScore: result.overallHealthScore ?? 70,
        summary: result.summary || '',
        recommendations: result.recommendations || {
          diet: [],
          exercise: [],
          sleep: [],
          supplements: [],
          followUp: [],
        },
        findings: result.findings || [],
        extractedText: extractedText || '',
        markers: fallbackMarkers,
      }

      if (this.hasColumn('confidenceScore')) {
        updatePayload.confidenceScore = result.confidenceScore ?? 0
      }

      if (this.hasColumn('reportType')) {
        updatePayload.reportType = result.reportType || type
      }

      if (this.hasColumn('overallHealthScore')) {
        updatePayload.overallHealthScore = result.overallHealthScore ?? 70
      }

      if (this.hasColumn('longTermInsights')) {
        updatePayload.longTermInsights = result.longTermInsights || []
      }

      if (this.hasColumn('fiveYearAnswers')) {
        updatePayload.fiveYearAnswers = result.fiveYearAnswers || []
      }

      if (this.hasColumn('riskCategories')) {
        updatePayload.riskCategories = result.riskCategories || {}
      }

      if (this.hasColumn('keyInsights')) {
        updatePayload.keyInsights = result.keyInsights || []
      }

      if (this.hasColumn('positiveFindings')) {
        updatePayload.positiveFindings = result.positiveFindings || []
      }

      if (this.hasColumn('criticalFindings')) {
        updatePayload.criticalFindings = result.criticalFindings || []
      }

      if (this.hasColumn('missingImportantMarkers')) {
        updatePayload.missingImportantMarkers = result.missingImportantMarkers || []
      }

      if (this.hasColumn('patternAnalysis')) {
        updatePayload.patternAnalysis = result.patternAnalysis || []
      }

      if (this.hasColumn('dnaTraits')) {
        updatePayload.dnaTraits = result.dnaTraits || []
      }

      if (this.hasColumn('warnings')) {
        updatePayload.warnings = result.warnings || []
      }

      if (this.hasColumn('medicineSuggestions')) {
        updatePayload.medicineSuggestions = result.medicineSuggestions || []
      }

      await this.repo.update(reportId, updatePayload)
    } catch (err) {
      console.error('processReport error:', err)
      await this.repo
        .update(reportId, {
          status: 'error',
          summary: 'Failed to process report.',
        })
        .catch(() => {})
    }
  }

  private hasColumn(column: string) {
    return !!this.repo.metadata.columns.find((c) => c.propertyName === column)
  }

  private async readFallbackText(reportId: string, filePath: string) {
    const report = await this.repo.findOne({ where: { id: reportId } })

    const candidates = [
      filePath,
      report?.fileUrl ? path.join(process.cwd(), report.fileUrl.replace(/^\//, '')) : '',
      report?.fileUrl || '',
    ].filter(Boolean)

    for (const candidate of candidates) {
      try {
        if (candidate && fs.existsSync(candidate)) {
          const ext = path.extname(candidate).toLowerCase()

          if (ext === '.pdf' || ['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'].includes(ext)) {
            continue
          }

          const text = fs.readFileSync(candidate, 'utf8')
          if (text && text.trim().length > 20) return text
        }
      } catch (err) {
        console.warn('[readFallbackText] failed for:', candidate, err)
      }
    }

    return ''
  }

private extractBloodMarkersFromText(text: string): Marker[] {
  const lines = String(text || '')
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const defs: { name: string; labels: string[] }[] = [
    { name: 'Hemoglobin', labels: ['hemoglobin', 'haemoglobin', 'hb'] },
    { name: 'WBC', labels: ['wbc', 'white blood cell', 'total wbc count', 'tlc'] },
    { name: 'RBC', labels: ['rbc', 'red blood cell'] },
    { name: 'Platelets', labels: ['platelet count', 'platelets'] },
    { name: 'Glucose', labels: ['fasting plasma glucose', 'fasting glucose', 'glucose', 'blood sugar', 'rbs', 'fbs'] },
    { name: 'TSH', labels: ['tsh'] },
    { name: 'AST', labels: ['ast', 'sgot'] },
    { name: 'ALT', labels: ['alt', 'sgpt'] },
    { name: 'Cholesterol', labels: ['cholesterol', 'total cholesterol'] },
    { name: 'LDL Cholesterol', labels: ['ldl cholesterol', 'ldl'] },
    { name: 'HDL Cholesterol', labels: ['hdl cholesterol', 'hdl'] },
    { name: 'Triglycerides', labels: ['triglycerides', 'tg'] },
    { name: 'Vitamin D', labels: ['vitamin d', '25-oh vitamin d', '25 hydroxy vitamin d'] },
    { name: 'Vitamin B12', labels: ['vitamin b12', 'b12'] },
    { name: 'Ferritin', labels: ['ferritin'] },
    { name: 'hs-CRP', labels: ['hs-crp', 'hs crp', 'crp'] },
    { name: 'Creatinine', labels: ['creatinine'] },
    { name: 'HbA1c', labels: ['hba1c', 'glycated hemoglobin'] },
  ]

  const skipLine = (line: string) =>
    /^(page no|barcode no|report released on|sample collected on|sample received on|age\s*:|p\.?\s*id|accession no|billing date|report status|sex\s*:|name\s*:|mr\.|mrs\.|dr\.|client processed by|pathkind diagnostics|clinical significance|end of report|\(?method\b|sample type)/i.test(line)

  const parseValue = (line: string) => {
    const cleaned = line.replace(/[,;]/g, ' ')
    const patterns = [
      /(?:^|\s)([<>]?\d+(?:\.\d+)?)(\s*[a-zA-Zμ/%/.-][a-zA-Z0-9μ/%/.-]*)?/,
      /([<>]?\d+(?:\.\d+)?\s*:\s*\d+)/,
    ]

    for (const re of patterns) {
      const m = cleaned.match(re)
      if (m) {
        const value = (m[1] || '').trim()
        // Units are often glued to the next column, e.g. "g/dL13.0-18.0" or
        // "mg/dLOptimal": cut at the first digit and drop a trailing word.
        const unit = (m[2] || '')
          .trim()
          .replace(/\d.*$/, '')
          .replace(/(?<=[a-zA-Z/])[A-Z][a-z]+$/, '')
        if (value && !/^\d{6,}$/.test(value)) return { value, unit }
      }
    }
    return null
  }

  const markers: Marker[] = []

  for (const def of defs) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (skipLine(line)) continue

      const lower = line.toLowerCase()
      if (!def.labels.some((l) => lower.includes(l))) continue

      const candidates = [line, ...lines.slice(i + 1, i + 5)]

      for (const candidate of candidates) {
        if (skipLine(candidate)) continue
        const parsed = parseValue(candidate)
        if (parsed) {
          markers.push({
            name: def.name,
            value: parsed.value,
            unit: this.normalizeUnit(parsed.unit || ''),
          })
          break
        }
      }

      break
    }
  }

  return this.uniqueMarkers(markers)
}

  private extractDnaFindingsAsMarkers(text: string): Marker[] {
    const markers: Marker[] = []

    const patterns = [
      { name: 'APOE', regex: /APOE[^\n]*?(E\d\/E\d|e\d\/e\d)/i },
      { name: 'MTHFR', regex: /MTHFR[^\n]*?(C677T\s+Heterozygous|C677T\s+Homozygous|A1298C\s+Heterozygous|Variant detected)/i },
      { name: 'FTO', regex: /FTO[^\n]*?(AA genotype|Risk variant present|No risk variant|AT genotype|TT genotype)/i },
      { name: 'TCF7L2', regex: /TCF7L2[^\n]*?(CT genotype|TT genotype|CC genotype|Risk variant present)/i },
      { name: 'PPARG', regex: /PPARG[^\n]*?(Pro12Pro|Variant detected|Normal variant)/i },
      { name: 'VDR', regex: /VDR[^\n]*?(bb genotype|Bb genotype|BB genotype|Low absorption)/i },
      { name: 'LCT', regex: /LCT[^\n]*?(C\/T heterozygous|Partial tolerance|Lactase persistence variant absent)/i },
      { name: 'HFE', regex: /HFE[^\n]*?(H63D heterozygous|H63D homozygous|Carrier|Negative)/i },
      { name: 'CYP1A2', regex: /CYP1A2[^\n]*?(Slow metabolism variant present|Slow metabolizer|Fast metabolizer)/i },
      { name: 'COMT', regex: /COMT[^\n]*?(Variant detected|Normal|High activity|Low activity)/i },
      { name: 'BDNF', regex: /BDNF[^\n]*?(Variant detected|Normal|High activity|Low activity)/i },
      { name: 'ACE', regex: /ACE[^\n]*?(Variant detected|Normal|Insertion|Deletion)/i },
      { name: 'ACTN3', regex: /ACTN3[^\n]*?(Variant detected|Normal|RR|RX|XX)/i },
      { name: 'CLOCK', regex: /CLOCK[^\n]*?(Variant detected|Normal)/i },
      { name: 'PER3', regex: /PER3[^\n]*?(Variant detected|Normal)/i },
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern.regex)
      if (match) {
        markers.push({
          name: pattern.name,
          value: match[1].trim(),
          unit: '',
        })
      }
    }

    return this.uniqueMarkers(markers)
  }

  private async extractTextFromFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase()

    try {
      if (ext === '.pdf') return await this.extractFromPdf(filePath)

      if (['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'].includes(ext)) {
        return await this.extractFromImage(filePath)
      }

      if (['.txt', '.csv', '.json'].includes(ext)) {
        return fs.readFileSync(filePath, 'utf8')
      }

      return ''
    } catch (err: any) {
      console.error('extractTextFromFile failed:', err)
      return ''
    }
  }

  private async extractFromPdf(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath)
    let extractedText = ''

    try {
      const pdfModule: any = pdfParse as any

      if (typeof pdfModule === 'function') {
        const data = await pdfModule(buffer)
        extractedText = data?.text || ''
      } else if (typeof pdfModule?.default === 'function') {
        const data = await pdfModule.default(buffer)
        extractedText = data?.text || ''
      }
    } catch (err) {
      console.warn('pdf-parse failed:', err)
    }

    // Keep line breaks: marker extraction reads the text line by line.
    const cleanText = (extractedText || '')
      .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, ' ')
      .replace(/[^\S\n]+/g, ' ')
      .replace(/\n\s*\n+/g, '\n')
      .trim()

    console.log('[extractFromPdf] file:', filePath)
    console.log('[extractFromPdf] pdf-parse length:', cleanText.length)

    if (cleanText.length > 80 && !this.looksLikePdfBinary(cleanText)) {
      return cleanText
    }

    console.log('[extractFromPdf] trying Unlimited-OCR for:', filePath)
    const unlimitedText = await this.unlimitedOcr.ocrFile(filePath)
    if (unlimitedText && unlimitedText.length > cleanText.length) {
      console.log('[extractFromPdf] Unlimited-OCR succeeded, length:', unlimitedText.length)
      return unlimitedText
    }

    const geminiText = await this.aiService.transcribeDocument(filePath)
    if (geminiText && geminiText.length > cleanText.length) {
      console.log('[extractFromPdf] Gemini transcription succeeded, length:', geminiText.length)
      return geminiText
    }

    console.log('[extractFromPdf] falling back to Tesseract OCR for:', filePath)
    return await this.ocrPdfFallback(filePath)
  }

  private looksLikePdfBinary(text: string) {
    const lower = text.toLowerCase()
    return (
      lower.includes('%pdf') ||
      lower.includes('endobj') ||
      lower.includes('stream') ||
      lower.includes('xref')
    )
  }

  private async ocrPdfFallback(filePath: string): Promise<string> {
    try {
      const tempDir = path.join(process.cwd(), 'uploads', 'ocr-temp')
      fs.mkdirSync(tempDir, { recursive: true })

      const { fromPath } = require('pdf2pic')
      const converter = fromPath(filePath, {
        density: 300,
        saveFilename: `medivoy-${Date.now()}`,
        savePath: tempDir,
        format: 'png',
        width: 2000,
        height: 2800,
      })

      const pages: string[] = []

      for (let i = 1; i <= 5; i++) {
        try {
          const page = await converter(i, { responseType: 'image' })
          if (page?.path) {
            console.log('[ocrPdfFallback] generated page:', page.path)
            pages.push(page.path)
          }
        } catch (err) {
          console.warn(`[ocrPdfFallback] stopped at page ${i}:`, err)
          break
        }
      }

      if (!pages.length) {
        console.warn('[ocrPdfFallback] no pages generated')
        return ''
      }

      return await this.ocrImages(pages)
    } catch (err) {
      console.error('OCR PDF fallback failed:', err)
      return ''
    }
  }

  private async extractFromImage(filePath: string): Promise<string> {
    console.log('[extractFromImage] trying Unlimited-OCR for:', filePath)
    const unlimitedText = await this.unlimitedOcr.ocrFile(filePath)
    if (unlimitedText) {
      console.log('[extractFromImage] Unlimited-OCR succeeded, length:', unlimitedText.length)
      return unlimitedText
    }

    const geminiText = await this.aiService.transcribeDocument(filePath)
    if (geminiText) {
      console.log('[extractFromImage] Gemini transcription succeeded, length:', geminiText.length)
      return geminiText
    }

    console.log('[extractFromImage] falling back to Tesseract OCR for:', filePath)
    return await this.ocrImages([filePath])
  }

  private async ocrImages(imagePaths: string[]): Promise<string> {
    if (!imagePaths.length) return ''

    console.log('[ocrImages] imagePaths:', imagePaths)

    const worker = await createWorker('eng')

    try {
      let combined = ''

      for (const imagePath of imagePaths) {
        try {
          const { data } = await worker.recognize(imagePath)
          const text = (data?.text || '').trim()
          console.log('[ocrImages] image:', imagePath, 'text length:', text.length)
          if (text) combined += `${text}\n`
        } catch (err) {
          console.warn('OCR image failed:', imagePath, err)
        }
      }

      return combined.trim()
    } finally {
      await worker.terminate()
    }
  }

private normalizeUnit(unit: string) {
  const u = String(unit || '').trim()
  if (!u) return ''

  if (/^(Mrs\.?|Mr\.?|Ms\.?|Dr\.?|Age|Male|Female|Page|No\.?)$/i.test(u)) return ''
  if (/^(gm\/dL|g\/dL)$/i.test(u)) return 'g/dL'
  if (/^mgdL$/i.test(u)) return 'mg/dL'
  if (/^pgmL$/i.test(u)) return 'pg/mL'
  if (/^ngmL$/i.test(u)) return 'ng/mL'
  if (/^mgL$/i.test(u)) return 'mg/L'
  if (/^KmcL$/i.test(u)) return 'K/mcL'
  if (/^MmcL$/i.test(u)) return 'M/mcL'
  return u
}

  async findByUser(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string, userId: string) {
    const report = await this.repo.findOne({ where: { id, userId } })
    if (!report) throw new HttpException('Report not found', 404)
    return report
  }

  async update(id: string, updates: Partial<Report>) {
    await this.repo.update(id, updates)
    return this.repo.findOne({ where: { id } })
  }

  async remove(id: string, userId: string) {
    const report = await this.findOne(id, userId)
    await this.repo.delete(report.id)
    return { message: 'Report deleted successfully', id: report.id }
  }

  private uniqueMarkers(markers: Marker[]) {
    const map = new Map<string, Marker>()
    for (const marker of markers) {
      if (!map.has(marker.name)) map.set(marker.name, marker)
    }
    return [...map.values()]
  }
}