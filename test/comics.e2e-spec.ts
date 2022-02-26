import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ComicsModule } from '../src/comics/comics.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../src/db/ormconfig';
import { ConfigModule } from '@nestjs/config';

describe('ComicsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
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
      it('Normal with name', async () => {
        const response = await request(app.getHttpServer())
          .post('/comics')
          .send({ name: 'Test Comic 1', price: 2500 })
          .expect(201);
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: 'Test Comic 1',
          price: 2500,
          description: null,
          image: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it('Empty Name', async () => {
        return request(app.getHttpServer())
          .post('/comics')
          .send({ name: '' })
          .expect(400, {
            statusCode: 400,
            message: [
              'name should not be empty',
              'price should not be empty',
              'price must be a number conforming to the specified constraints',
            ],
            error: 'Bad Request',
          });
      });

      it('Name with number', async () => {
        return request(app.getHttpServer())
          .post('/comics')
          .send({ name: 23 })
          .expect(400);
      });

      it('Name with boolean', async () => {
        return request(app.getHttpServer())
          .post('/comics')
          .send({ name: true })
          .expect(400);
      });

      it('Name with description', async () => {
        const response = await request(app.getHttpServer())
          .post('/comics')
          .send({ name: 'Test Comic 2', description: 'Test Comic Description' })
          .expect(201);
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: 'Test Comic 2',
          description: 'Test Comic Description',
        });
      });

      it('Name with empty description', () => {
        return request(app.getHttpServer())
          .post('/comics')
          .send({ name: 'Test Comic 2', description: '' })
          .expect(400);
      });

      it('Name with number description', () => {
        return request(app.getHttpServer())
          .post('/comics')
          .send({ name: 'Test Comic 2', description: 200 })
          .expect(400);
      });

      it('Name with boolean description', () => {
        return request(app.getHttpServer())
          .post('/comics')
          .send({ name: 'Test Comic 2', description: false })
          .expect(400);
      });
    });
    describe('/comics (GET) Tests', () => {
      it('/comics (GET) Empty Response', async () => {
        const response = await request(app.getHttpServer())
          .get('/comics')
          .expect(200);

        expect(response.body).toEqual([]);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
