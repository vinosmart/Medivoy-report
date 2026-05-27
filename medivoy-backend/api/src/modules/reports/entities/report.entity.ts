import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  fileUrl: string;

  @Column({ nullable: true, type: 'text' })
  ocrText: string;

  @Column({ nullable: true, type: 'json' })
  structuredMarkers: any;

  @Column({ nullable: true })
  riskScore: number;

  @Column({ nullable: true, type: 'text' })
  aiSummary: string;

  @Column({ nullable: true, type: 'json' })
  recommendations: string[];

  @CreateDateColumn()
  createdAt: Date;
}
