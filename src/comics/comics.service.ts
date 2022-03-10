import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComicDto } from './dto/create-comic.dto';
import { UpdateComicImageDto } from './dto/update-comic-image.dto';
import { UpdateComicDto } from './dto/update-comic.dto';
import { Comic } from './entities/comic.entity';

@Injectable()
export class ComicsService {
  constructor(
    @InjectRepository(Comic)
    private comicRepository: Repository<Comic>,
  ) {}

  create(createComicDto: CreateComicDto): Promise<Comic> {
    return this.comicRepository.save(createComicDto, { reload: true});
  }

  findAll(): Promise<Comic[]> {
    return this.comicRepository.find();
  }

  findOne(id: number): Promise<Comic | undefined> {
    return this.comicRepository.findOneOrFail(id);
  }

  async update(id: number, updateComicDto: (UpdateComicDto | UpdateComicImageDto)): Promise<Comic> {
    const comic = await this.comicRepository.findOne(id);
    if (comic != undefined) {
      return this.comicRepository.save({
        ...comic,
        ...updateComicDto,
      });
    } else {
      throw new HttpException('Comic Not Found', HttpStatus.NOT_FOUND);
    }
  }

  remove(id: number) {
    return this.comicRepository.delete(id);
  }
}
