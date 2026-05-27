import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { readFileSync } from 'fs'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ReportsService } from './reports.service'
import { AiService } from '../ai/ai.service'

@Controller('reports')
export class ReportsController {
  constructor(
    private reports: ReportsService,
    private ai: AiService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}${extname(file.originalname)}`)
      },
    }),
  }))
  async upload(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; type: string },
  ) {
    const userId = req.user.userId
    if (!userId) throw new Error('Authenticated user id missing')

    const report = await this.reports.create(
      userId,
      body.title || file.originalname,
      body.type || 'other',
      `/uploads/${file.filename}`,
    )

    try {
      await this.reports.update(report.id, { status: 'ocr_processing' })

      const fileBuffer = readFileSync(file.path)
      const base64 = fileBuffer.toString('base64')
      const mimeType = file.mimetype || 'application/pdf'
      const mistralKey = process.env.MISTRAL_API_KEY
      if (!mistralKey) throw new Error('MISTRAL_API_KEY not set')

      const ocrRes = await fetch('https://api.mistral.ai/v1/ocr', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mistralKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-ocr-latest',
          document: {
            type: 'document_url',
            document_url: `data:${mimeType};base64,${base64}`,
          },
          include_image_base64: false,
        }),
      })

      if (!ocrRes.ok) {
        const text = await ocrRes.text()
        throw new Error(`Mistral OCR failed: ${text}`)
      }

      const ocrData = await ocrRes.json()
      const ocrText = ocrData.pages?.length
        ? ocrData.pages.map((p: any) => p.markdown || p.text || '').join('\n\n')
        : ''

      const structuredMarkers = ocrText ? this.parseMarkers(ocrText) : []

      await this.reports.update(report.id, {
        status: 'ai_analyzing',
        ocrText,
        structuredMarkers,
      })

      const aiResult = await this.ai.analyzeReport(ocrText, structuredMarkers)

      return await this.reports.update(report.id, {
        status: 'completed',
        riskScore: aiResult.riskScore || 30,
        aiSummary: aiResult.summary || 'Analysis complete.',
        recommendations: aiResult.recommendations || [],
      })
    } catch (err: any) {
      await this.reports.update(report.id, {
        status: 'failed',
        aiSummary: err?.message || 'OCR/AI processing failed',
      })
      throw err
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getReports(@Req() req) {
    return this.reports.findByUser(req.user.userId)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getReport(@Req() req, @Param('id') id: string) {
    return this.reports.findOne(id, req.user.userId)
  }

private parseMarkers(text: string): any[] {
  const markers: any[] = []
  const pattern = /(Hemoglobin|HbA1c|Glucose|LDL|HDL|Triglycerides|Cholesterol|WBC|RBC|Platelets|Creatinine|BUN|ALT|AST|TSH|Vitamin D|Vitamin B12|Iron|Ferritin|hs-CRP|CRP)\s*[:\s]*([\d.]+)\s*([a-zA-Z/%²³-]*)/gi

  let match
  while ((match = pattern.exec(text)) !== null) {
    markers.push({
      name: match[1],
      value: match[2],
      unit: match[3] || '',
    })
  }

  return markers
}
}