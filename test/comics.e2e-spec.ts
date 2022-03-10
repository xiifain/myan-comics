import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ComicsModule } from '../src/comics/comics.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../src/db/ormconfig';
import { ConfigModule } from '@nestjs/config';
import { ChaptersModule } from '../src/chapters/chapters.module';


describe('ComicsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        ComicsModule,
        ChaptersModule,
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

  describe('Comics E2E Tests ', () => {
    beforeEach(async () => {
      const uncleared = await request(app.getHttpServer()).get('/comics');
      await Promise.all(
        uncleared.body.map(async (comic) => {
          return request(app.getHttpServer()).delete(`/comics/${comic.id}`);
        }),
      );
    });

    describe('/comics (POST) Tests', () => {
      describe('/comics (POST) Success', () => {
        it('Name', async () => {
          const response = await request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'Test Comic 1' })
            .expect(201);
          expect(response.body).toEqual({
            id: expect.any(Number),
            name: 'Test Comic 1',
            description: null,
            image: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });

        it('Name & Description', async () => {
          const response = await request(app.getHttpServer())
            .post('/comics')
            .send({
              name: 'Test Comic 1',
              description: 'Description for the comic',
            })
            .expect(201);
          expect(response.body).toEqual({
            id: expect.any(Number),
            name: 'Test Comic 1',
            description: 'Description for the comic',
            image: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
      });

      describe('/comics (POST) Fail', () => {
        it('(S)Name, (F)Description (description empty)', async () => {
          return request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'test', description: '' })
            .expect(400);
        });

        it('(S)Name, (F)Description (description number)', async () => {
          return request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'test', description: 2500 })
            .expect(400);
        });

        it('(S)Name, (F)Description (description boolean)', async () => {
          return request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'test', description: true })
            .expect(400);
        });

        it('(F)Name, (S)Description (name empty)', async () => {
          return request(app.getHttpServer())
            .post('/comics')
            .send({ name: '', description: 'test desc' })
            .expect(400);
        });

        it('(F)Name, (S)Description (name number)', async () => {
          return request(app.getHttpServer())
            .post('/comics')
            .send({ name: 123, description: 'test desc' })
            .expect(400);
        });

        it('(F)Name, (S)Description (name boolean)', async () => {
          return request(app.getHttpServer())
            .post('/comics')
            .send({ name: true, description: 'test desc' })
            .expect(400);
        });
      });
    });
    describe('/comics (GET) Tests', () => {
      describe('/comics (GET) Success', () => {
        it('Get All Comics (Empty List)', async () => {
          return request(app.getHttpServer()).get('/comics').expect(200, []);
        });

        it('Get All Comics (List with One Entry)', async () => {
          const response = await request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'Comics Test in Get' });
          return request(app.getHttpServer())
            .get('/comics')
            .expect(200, [{ ...response.body, chapters: []}]);
        });

        it('Get All Comics (List with Two Entry)', async () => {
          const response = await request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'Comics Test in Get' });
          const response1 = await request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'Comics Test in Get another' });
          return request(app.getHttpServer())
            .get('/comics')
            .expect(200);
        });

        it('Get One Comics with ID', async () => {
          const response = await request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'Comics One' });
          return request(app.getHttpServer())
            .get(`/comics/${response.body.id}`)
            .expect(200);
        });
      });
      describe('/comics (GET) Fail', () => {
        it('Get One Comics with ID that doesn\'t exist', async () => {
          const response = await request(app.getHttpServer())
            .post('/comics')
            .send({ name: 'Comics One Fail' });
          return request(app.getHttpServer())
            .get(`/comics/${response.body.id + 1}`)
            .expect(404, {
              statusCode: 404,
              message: `Comic with ID ${+response.body.id + 1} doesn\'t exists`
            });
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
