# Introduction

This is a software development exercise for a TypeScript / Node.js backend developer position. More information to follow.

## Description

This exercise is based on [Nest](https://github.com/nestjs/nest) framework TypeScript starter project.

The development flow here is

* PostgreSQL databases running in a docker image: local development database, transient unit testing databases.
  PostgreSQL runs in non-default port 54320.

* However, I find it personally easier just in install NestJS locally and use only the database from the Docker environment. Docker 
  can be created scratch to run the tests from a clean slate.

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
docker exec -it local_db psql -U postgres -c "create database local_db"
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

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

[PostgreSQL on Dockerhub](https://hub.docker.com/_/postgres)

[class-validator](https://github.com/typestack/class-validator)
