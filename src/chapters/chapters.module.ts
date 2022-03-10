import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { Comic } from '../comics/entities/comic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter, Comic]),
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService]
})
export class ChaptersModule {}
