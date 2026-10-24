import { Injectable, Logger } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class UnlimitedOcrService {
  private readonly logger = new Logger(UnlimitedOcrService.name)
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = process.env.UNLIMITED_OCR_URL || 'http://127.0.0.1:8001'
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { signal: AbortSignal.timeout(5000) })
      if (!res.ok) return false
      const data = await res.json()
      return data?.loaded === true
    } catch {
      return false
    }
  }

  async ocrImage(filePath: string, options?: {
    prompt?: string
    imageSize?: number
    cropMode?: boolean
  }): Promise<string> {
    const form = new FormData()
    const blob = new Blob([fs.readFileSync(filePath)], { type: 'image/png' })
    form.set('file', blob, path.basename(filePath))
    form.set('prompt', options?.prompt ?? 'document parsing.')
    form.set('image_size', String(options?.imageSize ?? 640))
    form.set('crop_mode', String(options?.cropMode ?? true))

    const res = await fetch(`${this.baseUrl}/ocr/image`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(300000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error')
      throw new Error(`Unlimited-OCR image failed: ${res.status} ${errText}`)
    }

    const data = await res.json()
    return data?.text ?? ''
  }

  async ocrPdf(filePath: string, options?: {
    prompt?: string
  }): Promise<string> {
    const form = new FormData()
    const blob = new Blob([fs.readFileSync(filePath)], { type: 'application/pdf' })
    form.set('file', blob, path.basename(filePath))
    form.set('prompt', options?.prompt ?? 'Multi page parsing.')

    const res = await fetch(`${this.baseUrl}/ocr/pdf`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(300000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error')
      throw new Error(`Unlimited-OCR PDF failed: ${res.status} ${errText}`)
    }

    const data = await res.json()
    return data?.text ?? ''
  }

  async ocrFile(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase()

    try {
      if (ext === '.pdf') return await this.ocrPdf(filePath)
      return await this.ocrImage(filePath)
    } catch (err) {
      this.logger.warn(`Unlimited-OCR failed for ${filePath}:`, err)
      return ''
    }
  }
}
