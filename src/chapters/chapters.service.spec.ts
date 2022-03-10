import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comic } from '../comics/entities/comic.entity';
import { ChaptersService } from './chapters.service';
import { Chapter } from './entities/chapter.entity';

describe('ChaptersService', () => {
  let service: ChaptersService;

  const mockChapterRepository = {
    save: jest.fn().mockImplementation((chapter) => Promise.resolve({
      id: 1,
      name: chapter.name,
      description: chapter.description,
      comicId: 1
    })),
    findOneOrFail: jest.fn().mockImplementation((id) => Promise.resolve({
      id: 1,
      name: "Test Chapter One",
      description: "Test Description",
      comicId: 1
    })),
  };

  const mockComicRepository = {
    findOneOrFail: jest.fn().mockImplementation((id) => Promise.resolve({
        id: id,
        name: "Test Comic",
        description: "Test Description",
        chapters: []
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChaptersService,
        {
          provide: getRepositoryToken(Chapter),
          useValue: mockChapterRepository,
        },
        {
          provide: getRepositoryToken(Comic),
          useValue: mockComicRepository,
        },
      ],
    }).compile();

    service = module.get<ChaptersService>(ChaptersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Chapters Service Tests', () => {
    it('Should create a new Chapter', async () => {
      expect(
        await service.create({
          name: 'Test Chapter',
          description: 'Test Chapter Description',
          comic: 1,
        }),
      ).toBeCalled;
    });
  });
});
