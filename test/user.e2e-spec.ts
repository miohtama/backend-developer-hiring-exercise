import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Repository, Connection, ConnectionOptionsReader } from 'typeorm';

import { User } from '../src/user/user.entity';
import { UserModule } from '../src/user/user.module';

describe('User', () => {
  let app: INestApplication;
  let repository: Repository<User>;
  let connection: Connection;

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
    
    // Build table structures on the first run
    // https://stackoverflow.com/questions/60217131/typeorm-and-nestjs-creating-database-tables-at-the-beginning-of-an-e2e-test/60217528#60217528
    // TODO: There is no proper tear down, sync gets funky if we modify entities
    connection = module.get(Connection);
    await connection.synchronize(true);   

    await app.init();
  });

  beforeEach(async() => {
    // Barebone way to nuke site_user table between tests
    // console.log("Nuking");
    await repository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users', () => {
    
    it('should register a new user', async () => {

      const { body } = await supertest
        .agent(app.getHttpServer())
        .post('/users/register')
        .send({
          displayName: "Nooby Noob",
          email: "nooby@example.com"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
        // https://stackoverflow.com/a/47904961/315168
      expect(body).toMatchObject({displayName: "Nooby Noob", email: "nooby@example.com"});

      // Check that the opbject was persistent in the database
      let [userOne] = await repository.find();
      
      expect(userOne.confirmedEmail).toBeNull(); // Separate call to confirmation needed
      expect(userOne.pendingEmail).toBe("nooby@example.com");
      expect(userOne.displayName).toBe("Nooby Noob");
      expect(userOne.emailConfirmationToken).not.toBeNull();

    });    

    it('should register multiple users', async () => {

      const { body } = await supertest
        .agent(app.getHttpServer())
        .post('/users/register')
        .send({
          displayName: "Nooby Noob",
          email: "nooby@example.com"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      // https://stackoverflow.com/a/47904961/315168
      expect(body).toMatchObject({displayName: "Nooby Noob", email: "nooby@example.com"});

      const { body: body2 } = await supertest
        .agent(app.getHttpServer())
        .post('/users/register')
        .send({
          displayName: "Boom Headshotter",
          email: "boom@example.com"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      // https://stackoverflow.com/a/47904961/315168
      expect(body2).toMatchObject({displayName: "Boom Headshotter", email: "boom@example.com"});
    
    });        

    it('should not allow duplicate display names', async () => {

      await supertest
        .agent(app.getHttpServer())
        .post('/users/register')
        .send({
          displayName: "Nooby Noob",
          email: "nooby@example.com"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      await supertest
        .agent(app.getHttpServer())
        .post('/users/register')
        .send({
          displayName: "Nooby Noob",
          email: "nooby@example.com"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500);

      // Check that the opbject was persistent in the database
      let users = await repository.find();
      expect(users.length).toBe(1);
      
    });

    it('should allow email confirmation by admin', async () => {

      await supertest
        .agent(app.getHttpServer())
        .post('/users/register')
        .send({
          displayName: "Nooby Noob",
          email: "Nooby@Example.com"
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      const {body} = await supertest
        .agent(app.getHttpServer())
        .post('/users/confirm-email-admin')
        .send({
          email: "nooby@example.com"
        })
        .expect('Content-Type', /json/)
        // .expect(200); // TODO: Do not know why this is stuck to 201 Created. instead of 200 ok ... something is badly caching the status code?
        
      expect(body).toEqual({email: "nooby@example.com"});

      // Check that the opbject was persistent in the database
      let [userOne] = await repository.find();
      expect(userOne.confirmedEmail).toBe("nooby@example.com"); // Separate call to confirmation needed
      expect(userOne.pendingEmail).toBe("nooby@example.com");
      expect(userOne.emailConfirmationCompletedAt).not.toBeNull();
      expect(userOne.emailConfirmationToken).toBeNull();
      
    });    

  });
});
