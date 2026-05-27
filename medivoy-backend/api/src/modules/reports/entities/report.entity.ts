import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() userId: string
  @Column() title: string
  @Column({ default: 'blood' }) type: string
  @Column() fileUrl: string
  @Column({ nullable: true, default: '' }) forMember: string
  @Column({ default: 'processing' }) status: string
  @Column({ nullable: true }) riskScore: number
  @Column({ nullable: true, type: 'text' }) summary: string
  @Column({ nullable: true, type: 'json' }) recommendations: string[]
  @Column({ nullable: true, type: 'json' }) findings: any[]
  @Column({ nullable: true, type: 'json' }) markers: any[]
  @Column({ nullable: true, type: 'text' }) extractedText: string
  @CreateDateColumn() createdAt: Date
}