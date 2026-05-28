import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export type ReportRecommendations = {
  diet: string[]
  exercise: string[]
  sleep: string[]
  supplements: string[]
  followUp: string[]
}

export type FiveYearAnswer = {
  year: number
  question: string
  answer: string
  outlook: 'low' | 'moderate' | 'high'
}

export type LongTermRiskInsight = {
  horizonYears: number
  title: string
  outlook: 'low' | 'moderate' | 'high'
  insight: string
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  title: string

  @Column({ default: 'blood' })
  type: string

  @Column()
  fileUrl: string

  @Column({ nullable: true, default: '' })
  forMember: string

  @Column({ default: 'processing' })
  status: string

  @Column({ nullable: true, type: 'float' })
  riskScore: number | null

  @Column({ nullable: true, type: 'float' })
  overallHealthScore: number | null

  @Column({ nullable: true, type: 'float' })
  confidenceScore: number | null

  @Column({ nullable: true })
  reportType: string | null

  @Column({ nullable: true, type: 'text' })
  summary: string | null

  @Column({ nullable: true, type: 'json' })
  recommendations: ReportRecommendations | null

  @Column({ nullable: true, type: 'json' })
  findings: any[] | null

  @Column({ nullable: true, type: 'json' })
  markers: any[] | null

  @Column({ nullable: true, type: 'json' })
  longTermInsights: LongTermRiskInsight[] | null

  @Column({ nullable: true, type: 'json' })
  fiveYearAnswers: FiveYearAnswer[] | null

  @Column({ nullable: true, type: 'json' })
  riskCategories: Record<string, number> | null

  @Column({ nullable: true, type: 'json' })
  keyInsights: string[] | null

  @Column({ nullable: true, type: 'json' })
  positiveFindings: string[] | null

  @Column({ nullable: true, type: 'json' })
  criticalFindings: string[] | null

  @Column({ nullable: true, type: 'json' })
  missingImportantMarkers: string[] | null

  @Column({ nullable: true, type: 'json' })
  patternAnalysis: any[] | null

  @Column({ nullable: true, type: 'json' })
  dnaTraits: any[] | null

  @Column({ nullable: true, type: 'json' })
  warnings: string[] | null

  @Column({ nullable: true, type: 'text' })
  extractedText: string | null

  @CreateDateColumn()
  createdAt: Date
}