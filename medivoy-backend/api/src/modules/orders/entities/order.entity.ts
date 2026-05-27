import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() userId: string
  @Column() kitId: string
  @Column() kitName: string
  @Column() price: string
  @Column({ default: 'processing' }) status: string
  @Column({ nullable: true }) address: string
  @CreateDateColumn() createdAt: Date
}