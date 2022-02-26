import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComicsService } from './comics.service';
import { Comic } from './entities/comic.entity';

describe('ComicsService', () => {
  let service: ComicsService;

  const mockComicRepository = {
    save: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({ id: 1, ...dto })),
    find: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Comic' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComicsService,
        {
          provide: getRepositoryToken(Comic),
          useValue: mockComicRepository,
        },
      ],
    }).compile();

    service = module.get<ComicsService>(ComicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Comics (CREATE)', () => {
  });

  describe('Comics (GET)', () => {
  });

  describe('Comics (PATCH)', () => {
  });

  describe('Comics (DELETE)', () => {
  });
});
