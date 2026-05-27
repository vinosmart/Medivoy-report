import { Injectable, HttpException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Report } from './entities/report.entity'
import { AiService, Marker } from '../ai/ai.service'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repo: Repository<Report>,
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

    // Process asynchronously — do not block the HTTP response
    this.processReport(saved.id, filePath || '', type).catch((err) => {
      console.error('processReport failed:', err)
      
    })

    return saved
  }

private async processReport(reportId: string, filePath: string, type: string) {
  try {
    let ocrText = ''
    const markers: Marker[] = []

    console.log('TYPE:', type)
    console.log('FILE PATH:', filePath)
    console.log('FILE EXISTS:', !!filePath && fs.existsSync(filePath))

    if (filePath && fs.existsSync(filePath)) {
      ocrText = await this.extractTextFromFile(filePath, type)
    }

    console.log('OCR LENGTH:', ocrText.length)
    console.log('OCR TEXT:', ocrText.slice(0, 1500))

    const result = await this.aiService.analyzeReport(ocrText, markers, type)

    const updatePayload: any = {
      status: 'done',
      riskScore: result.riskScore,
      summary: result.summary,
      recommendations: result.recommendations,
      findings: result.findings,
      extractedText: ocrText,
      markers: result.findings.map((f) => ({
        name: f.label,
        value: f.value,
        unit: '',
      })),
    }

    await this.repo.update(reportId, updatePayload)
  } catch (err) {
    console.error('processReport error:', err)
    await this.repo.update(reportId, {
      status: 'error',
      summary: 'Failed to process report.',
    }).catch(() => {})
  }
}

  private async extractTextFromFile(filePath: string, type: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase()

    try {
      if (ext === '.pdf') {
        try {
          const buffer = fs.readFileSync(filePath)

          // Prefer classic functional API if installed (pdf-parse@1.1.1)
          try {
            const pdfParse = require('pdf-parse')
            if (typeof pdfParse === 'function') {
              const data = await pdfParse(buffer)
              return data?.text || ''
            }
          } catch (e) {
            console.warn('classic pdf-parse failed, trying alt export...', e)
          }

          // Try default export / class-style export compatibility
          try {
            const pdfModule = require('pdf-parse')
            const PDFParse = pdfModule?.default || pdfModule?.PDFParse || null

            if (typeof PDFParse === 'function') {
              try {
                const parser = new PDFParse({ data: buffer })
                if (typeof parser.getText === 'function') {
                  const result = await parser.getText()
                  return result?.text || result || ''
                }
                if (typeof parser.parse === 'function') {
                  const result = await parser.parse()
                  return result?.text || result || ''
                }
              } catch (err) {
                console.warn('class-based pdf-parse failed:', err)
              }
            }
          } catch (e) {
            console.warn('alternate pdf-parse export failed:', e)
          }

          return `PDF parse failed: unsupported pdf-parse export for ${path.basename(filePath)}. Try installing pdf-parse@1.1.1`
        } catch (err: any) {
          console.error('pdf extraction failed:', err)
          return `PDF parse failed: ${err?.message || 'unknown error'}`
        }
      }

      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        try {
          const Tesseract = require('tesseract.js')
          const { data: { text } } = await Tesseract.recognize(filePath, 'eng')
          return text || ''
        } catch (err: any) {
          console.error('tesseract failed:', err)
          return `Image OCR failed: ${err?.message || 'Install tesseract.js'}`
        }
      }

      if (ext === '.txt') {
        return fs.readFileSync(filePath, 'utf-8')
      }
    } catch (err: any) {
      console.error('extractTextFromFile failed:', err)
      return err?.message || ''
    }

    return ''
  }

  async findByUser(userId: string) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } })
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
}