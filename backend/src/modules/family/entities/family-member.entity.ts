import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('family_members')
export class FamilyMember {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column() userId: string
  @Column() name: string
  @Column({ nullable: true }) relation: string
  @Column({ nullable: true }) age: string
  @Column({ nullable: true, type: 'text' }) conditions: string
  @CreateDateColumn() createdAt: Date
}