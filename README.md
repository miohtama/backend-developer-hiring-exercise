# Introduction

This is a software development exercise for a TypeScript / Node.js backend developer position. More information to follow.

## Description

This exercise is based on [Nest](https://github.com/nestjs/nest) framework TypeScript starter project.

The development flow here is

* PostgreSQL databases running in a docker image: local development database, transient unit testing databases.
  PostgreSQL runs in non-default port 54320.

* However, I find it personally easier just in install NestJS locally and use only the database from the Docker environment. Docker 
  can be created scratch to run the tests from a clean slate.

* The project uses [NestJS Swagger plugin for automatic interface generation](https://docs.nestjs.com/recipes/swagger#plugin)

The development environment is tested on OSX, but should work on Linux systems unmodified.

## Prerequisites

* You need to understand UNIX shell, Docker, PostgreSQL 

## Installation

### Installing packages locally 

### Setting up PostgreSQL database

This is will make a new PostgreSQL running in the standard port 5432. 
Please shutdown any previous conflicting PostgreSQL instances before starting this.

```bash
docker-compose up -d
```

Check it is up

```bash
docker logs -f local_db
```

Check that you get a database with `psql`

```bash
docker exec -it local_db psql -U postgres 
```

Create empty development database

```
docker exec -it local_db psql -U local_dev -c "create database local_db"
```

### Setting up a local app

Then do the local app installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database and migrations

### Automatically generating migrations

```bash
npm run migration:generate -- -n CreateUsers
```

### Run migrations against a local db

```bash
npm run migration:run
```

Check the result of migrations
```bash
docker exec -it local_db psql -U local_dev -c "\dt" local_db 
```

## Test

Running unit tests
```bash
$ npm run test
```

Running e2e tests

(TODO: How to nicely create and tear down the test database on each run)

```bash
docker exec -it local_db psql -U local_dev -c "create database e2e_test" local_db  
npm run test:e2e
```

# test coverage
$ npm run test:cov
```

# Troubleshooting

Nuking the local development database

```sh
docker-compose down -v
````

# Further reading

[NestJS and TypeORM in 30 minutes](https://blog.theodo.com/2019/05/an-overview-of-nestjs-typeorm-release-your-first-application-in-less-than-30-minutes/)

[Another NestJS and TypeORM tutorial](https://blog.echobind.com/up-and-running-nextjs-and-typeorm-2c4dff5d7250)

[PostgreSQL on Dockerhub](https://hub.docker.com/_/postgres)

[class-validator](https://github.com/typestack/class-validator)

[Cats NestJS + Swagger sample full example code](https://github.com/nestjs/nest/tree/master/sample/11-swagger)

[Testing database interactoin with TypeORM](https://medium.com/@salmon.3e/integration-testing-with-nestjs-and-typeorm-2ac3f77e7628) and [related source code](https://github.com/p-salmon/nestjs-typeorm-integration-tests)

[Mikko's short style guide for TypeScript](https://twitter.com/moo9000/status/1228059823494881288)

# NestJS - TypeORM shortcomings

- No standard way to create PostgreSQL db/tear down db for the tests (Python has many)

- Documentation did not really cover how to use date columns properly. Are they strings? When they are date objects?

- Documentation does not show good examples of having functions directly on entity classes

- Reposity concept needs more explanation and examples https://typeorm.io/#/working-with-repository Questions raise: Do I need to write functions manually here? What functions are automatically generated? How does a normal repository look like - links to examples.

- Repository.create() does not work as advertised https://github.com/typeorm/typeorm/issues/2904

- NestJS: No idea how HTTP transaction retrying and PostgreSQL transaction conflict on the application level should be wired up - should be the default behavior in the name of safety

- 


