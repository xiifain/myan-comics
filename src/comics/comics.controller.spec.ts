import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComicsController } from './comics.controller';
import { ComicsService } from './comics.service';
import { CreateComicDto } from './dto/create-comic.dto';
import { Comic } from './entities/comic.entity';
import { faker } from '@faker-js/faker';
import { features } from 'process';

describe('ComicsController', () => {
  let controller: ComicsController;

  const comic = {
    id: faker.datatype.number(),
    name : faker.name.findName(),
    description: faker.lorem.paragraph(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  }

  const mockComicRepository = {
    save: jest.fn((dto : CreateComicDto) => {
      return {
        id: comic.id,
        createdAt: comic.createdAt,
        updatedAt: comic.updatedAt,
        description: dto.description,
        ...dto
      }
    }),
    find: jest.fn(() => { return [] }),
    findOneOrFail: jest.fn().mockImplementation((id) => Promise.resolve(comic))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComicsController],
      providers: [
        ComicsService,
        {
          provide: getRepositoryToken(Comic),
          useValue: mockComicRepository
        }
      ],
    }).compile();

    controller = module.get<ComicsController>(ComicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Comic Controller create Tests', () => {

    it('Create New Comic with name', () => {
      expect(controller.create({
        name: comic.name 
      })).toEqual({
        id: expect.any(Number),
        name: comic.name,
        description: undefined,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date) 
      });
    });

    it('Create New Comic with name and description', async () => {
      expect(controller.create({
        name: comic.name,
        description: comic.description
      })).toEqual({
        id: expect.any(Number),
        name: comic.name,
        description: comic.description,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date) 
      });
    });
  });

  describe('Comic Controller Get Tests', () => {
    it('Get All Comics', () => {
      expect(controller.findAll()).toBeInstanceOf(Array);
    });

    it('Get One Comics with ID', async () => {
      expect(await controller.findOne(`${comic.id}`)).toEqual(comic);
    });
  });
});
