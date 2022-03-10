import { Comic } from '../../comics/entities/comic.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Chapter extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column({ nullable : true })
  description?: string;

  @Column({ name: "comic_id" })
  comicId!: number;

  @ManyToOne(() => Comic, (comic) => comic.id, { eager: false , onDelete: 'CASCADE' })
  @JoinColumn({ name: "comic_id"})
  comic: Comic;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
