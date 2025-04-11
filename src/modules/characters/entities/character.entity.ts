import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'characters' })
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  species: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  origin: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  image: string;

  @Column('text', { array: true, nullable: true, default: [] })
  episode: string[];

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  created: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
