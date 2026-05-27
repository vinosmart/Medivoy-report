import { Injectable } from '@nestjs/common'

@Injectable()
export class AiService {
  async analyzeReport(ocrText: string, markers: any[] = []) {
    return {
      riskScore: 24,
      summary: 'Analysis placeholder. Integrate Mistral AI here.',
      recommendations: ['Consult a doctor', 'Monitor diet'],
    }
  }
}