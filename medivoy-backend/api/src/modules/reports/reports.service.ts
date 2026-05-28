import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Report } from './entities/report.entity'
import { AiService, Marker } from '../ai/ai.service'
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
      let ocrText = ''

      if (filePath && fs.existsSync(filePath)) {
        ocrText = await this.extractTextFromFile(filePath, type)
      }

      if (!ocrText || ocrText.trim().length < 20) {
        const fallback = await this.readFallbackText(reportId, filePath)
        if (fallback) ocrText = fallback
      }

      const normalizedType = String(type || '').toLowerCase()

      const markers =
        normalizedType === 'dna'
          ? this.extractDnaFindingsAsMarkers(ocrText)
          : normalizedType === 'blood'
            ? this.extractBloodMarkersFromText(ocrText)
            : []

      const result = await this.aiService.analyzeReport(ocrText, markers, type)

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
  extractedText: ocrText || '',
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

    for (const c of candidates) {
      try {
        if (c && fs.existsSync(c)) {
          const ext = path.extname(c).toLowerCase()
          if (ext === '.pdf' || ['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'].includes(ext)) {
            continue
          }

          const text = fs.readFileSync(c, 'utf8')
          if (text && text.trim().length > 20) return text
        }
      } catch {}
    }

    return ''
  }

  private extractBloodMarkersFromText(text: string): Marker[] {
    const lines = String(text || '')
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)

    const defs: { name: string; labels: string[] }[] = [
      { name: 'Hemoglobin', labels: ['hemoglobin', 'haemoglobin', 'hb'] },
      { name: 'WBC', labels: ['wbc', 'white blood cell', 'leucocyte', 'leukocyte'] },
      { name: 'RBC', labels: ['rbc', 'red blood cell'] },
      { name: 'Platelets', labels: ['platelets', 'platelet count'] },
      { name: 'Cholesterol', labels: ['cholesterol'] },
      { name: 'LDL Cholesterol', labels: ['ldl cholesterol', 'ldl'] },
      { name: 'HDL Cholesterol', labels: ['hdl cholesterol', 'hdl'] },
      { name: 'Triglycerides', labels: ['triglycerides', 'triglyceride', 'tg'] },
      { name: 'Glucose', labels: ['glucose', 'blood sugar', 'fbs', 'rbs', 'fasting glucose'] },
      { name: 'Vitamin D', labels: ['vitamin d', '25-oh vitamin d', '25 hydroxy vitamin d'] },
      { name: 'Vitamin B12', labels: ['vitamin b12', 'b12'] },
      { name: 'Ferritin', labels: ['ferritin'] },
      { name: 'Iron', labels: ['iron'] },
      { name: 'hs-CRP', labels: ['hs-crp', 'hs crp', 'crp'] },
      { name: 'HbA1c', labels: ['hba1c', 'glycated hemoglobin'] },
      { name: 'TSH', labels: ['tsh'] },
      { name: 'ALT', labels: ['alt', 'sgpt'] },
      { name: 'AST', labels: ['ast', 'sgot'] },
      { name: 'Creatinine', labels: ['creatinine'] },
    ]

    const markers: Marker[] = []

    for (const def of defs) {
      for (const line of lines) {
        const lower = line.toLowerCase()
        if (!def.labels.some((l) => lower.includes(l))) continue

        const m = line.match(/(?:[:\-]\s*)?([<>]?[=]?)\s*(\d+(?:\.\d+)?)\s*([a-zA-Z%/.-]+)/)
        if (m) {
          markers.push({
            name: def.name,
            value: m[2],
            unit: m[3],
          })
          break
        }
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

    for (const p of patterns) {
      const m = text.match(p.regex)
      if (m) {
        markers.push({
          name: p.name,
          value: m[1].trim(),
          unit: '',
        })
      }
    }

    return this.uniqueMarkers(markers)
  }

  private async extractTextFromFile(filePath: string, type: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase()

    try {
      if (ext === '.pdf') return await this.extractFromPdf(filePath)
      if (['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff'].includes(ext)) {
        return await this.extractFromImage(filePath)
      }
      if (['.txt', '.csv', '.json'].includes(ext)) return fs.readFileSync(filePath, 'utf8')
      return ''
    } catch (err: any) {
      console.error('extractTextFromFile failed:', err)
      return err?.message || ''
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

    const cleanText = (extractedText || '')
      .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, ' ')
      .trim()

    if (cleanText.length > 50 && !this.looksLikePdfBinary(cleanText)) {
      return cleanText
    }

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

      const pages: any[] = []
      for (let i = 1; i <= 5; i++) {
        try {
          const page = await converter(i, { responseType: 'image' })
          if (page?.path) pages.push(page.path)
        } catch {
          break
        }
      }

      return await this.ocrImages(pages)
    } catch (err) {
      console.error('OCR PDF fallback failed:', err)
      return ''
    }
  }

  private async extractFromImage(filePath: string): Promise<string> {
    return await this.ocrImages([filePath])
  }

  private async ocrImages(imagePaths: string[]): Promise<string> {
    if (!imagePaths.length) return ''

    const worker = await createWorker('eng')

    try {
      let combined = ''

      for (const imagePath of imagePaths) {
        try {
          const { data } = await worker.recognize(imagePath)
          const text = (data?.text || '').trim()
          if (text) combined += `${text}\n`
        } catch (err) {
          console.warn('OCR image failed:', err)
        }
      }

      return combined.trim()
    } finally {
      await worker.terminate()
    }
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