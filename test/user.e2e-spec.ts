import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';

import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';

describe('User', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 54320,
          username: 'local_dev',
          password: 'local_dev',
          database: 'e2e_test',
          entities: ['./**/*.entity.ts'],
          synchronize: false,
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    repository = module.get('UserRepository');

    // https://stackoverflow.com/questions/60217131/typeorm-and-nestjs-creating-database-tables-at-the-beginning-of-an-e2e-test/60217528#60217528
    const connection = repository.manager.connection;
    // dropBeforeSync: If set to true then it drops the database with all its tables and data 
    await connection.synchronize(true); 

    await app.init();
  });

  afterEach(async () => {
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      await repository.save([{ displayName: 'test-name-0', pendingEmail: "foobar@example.com" }, { displayName: 'test-name-1', pendingEmail: "foobar2@example.com" }]);

      const { body } = await supertest
        .agent(app.getHttpServer())
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body).toEqual([
        { id: expect.any(Number), name: 'test-name-0' },
        { id: expect.any(Number), name: 'test-name-1' },
      ]);
    });
  });

});
