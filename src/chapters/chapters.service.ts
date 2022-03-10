import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comic } from '../comics/entities/comic.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,

    @InjectRepository(Comic)
    private comicRepository: Repository<Comic>,
  ) {}

  async create(
    createChapterDto: CreateChapterDto,
  ): Promise<Chapter | EntityNotFoundError> {
    const comic: Comic = await this.comicRepository
      .findOneOrFail(createChapterDto.comic)
      .catch((error) => {
        return error;
      });
    const chapter = await this.chapterRepository.save(
      { ...createChapterDto, comic: comic }
    );
    return this.findOne(chapter.id);
  }

  findAll(): Promise<Chapter[]> {
    return this.chapterRepository.find();
  }

  findOne(id: number): Promise<Chapter> {
    return this.chapterRepository.findOneOrFail(id);
  }

  update(id: number, updateChapterDto: UpdateChapterDto) {
    return `Update Chapter action`;
  }

  remove(id: number) {
    return `This action removes a #${id} chapter`;
  }
}
