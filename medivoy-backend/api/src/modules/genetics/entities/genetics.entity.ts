import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm'

@Entity('genetics')
export class Genetics {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ unique: true }) userId: string
  @Column({ nullable: true, type: 'json' }) variants: any
  @Column({ nullable: true }) riskScore: number
  @Column({ nullable: true, type: 'text' }) summary: string
  @Column({ nullable: true, type: 'json' }) findings: any
  @Column({ nullable: true, type: 'json' }) recommendations: string[]
  @UpdateDateColumn() updatedAt: Date
}