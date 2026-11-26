import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ unique: true }) email: string
  @Column({ nullable: true }) password: string | null
  @Column({ unique: true, nullable: true }) googleId: string | null
  @Column({ nullable: true }) name: string | null
  @Column({ nullable: true }) avatarUrl: string | null
  @Column({ default: 'patient' }) role: string
  @CreateDateColumn() createdAt: Date
}
