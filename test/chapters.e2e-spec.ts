import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../src/db/ormconfig';
import { ConfigModule } from '@nestjs/config';
import { ChaptersModule } from '../src/chapters/chapters.module';
import { ComicsModule } from '../src/comics/comics.module';
import { Comic } from '../src/comics/entities/comic.entity';

describe('Chapters Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        ChaptersModule,
        ComicsModule,
        TypeOrmModule.forRoot({
          keepConnectionAlive: true,
          ...ormconfig,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Chapters E2E Tests ', () => {
    beforeEach(async () => {
      const uncleared = await request(app.getHttpServer()).get('/chapters');
      await Promise.all(
        uncleared.body.map(async (chapter) => {
          return request(app.getHttpServer()).delete(`/chapters/${chapter.id}`);
        }),
      );
    });

    describe('/chapters (POST) Tests', () => {
      it('(S)Name, (S)Comic ID -> Should create a new chapter with name & comic id that exists', () => {
        let comic: Comic = new Comic();
        request(app.getHttpServer())
          .post('/comics')
          .send({ name: 'Test Comic' })
          .then((response) => {
            comic = response.body;
            return request(app.getHttpServer())
              .post('/chapters')
              .send({ name: 'Chapter One', comic: comic.id })
              .expect(201);
          });
      });

      it('(S)Name, (S)Comic ID, (S)Description -> Should create a new chapter with name, description & comic id that exists', () => {
        let comic: Comic = new Comic();
        request(app.getHttpServer())
          .post('/comics')
          .send({ name: 'Test Comic' , description: 'Test Description of comic'})
          .then((response) => {
            comic = response.body;
            return request(app.getHttpServer())
              .post('/chapters')
              .send({ name: 'Chapter One', comic: comic.id , description: "Test Description of Chapter"})
              .expect(201);
          });
      });
    });

    it('/chapters (GET) Get All Comics', () => {
      return request(app.getHttpServer()).get('/chapters').expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
