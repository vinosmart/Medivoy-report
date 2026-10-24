import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm'

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ unique: true }) userId: string
  @Column({ nullable: true }) goal: string
  @Column({ nullable: true }) diet: string
  @Column({ nullable: true }) region: string
  @Column({ nullable: true }) age: string
  @Column({ nullable: true }) gender: string
  @UpdateDateColumn() updatedAt: Date
}