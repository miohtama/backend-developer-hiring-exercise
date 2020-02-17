# Introduction

This is a software development exercise for a TypeScript / Node.js backend developer position. More information to follow.

## Description

This exercise is based on [Nest](https://github.com/nestjs/nest) framework TypeScript starter project.

The development flow here is

* PostgreSQL databases running in a docker image: local development database, transient unit testing databases.
  PostgreSQL runs in non-default port 54320.

* App and NestJS is installed locally and use the database from the Docker environment.

* The project uses [NestJS OpenAPI (Swagger) plugin for automatic interface generation](https://docs.nestjs.com/recipes/swagger#plugin).

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
docker exec -it local_db psql -U local_dev -c "create database local_db" -d template1
```

### Setting up a local app

Then do the local app installation

```bash
npm install
```

Run initial migrations to set up initial database tables

```bash
npm run migration:run
```

## Running the app

Development
```bash 
npm run start
```

Then visit http://localhost:3000 to get the app landing page.

Visit http://localhost:3000/api/ to get the Swagger generated REST API tool.

Watch mode

```bash
npm run start:dev
```

Production mode

```bash
npm run start:prod
```

## Manual usage 

1. Post a registration request to /register

2. Confirm your email using /users/confirm-email-admin



## Database and migrations

### Automatically generating migrations

```bash

# Make sure we have not stale JS transpilation code around
rm -rf dist

# Rebuild transpilation
npm run build  

# You need to start the dev server to generate dist/migrations 
# NestJS bug https://github.com/nrwl/nx/issues/1393
npm run start

# Create a file under migration/
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

Running e2e tests. Please note that the server logger is not muted during these tests, so you get API errors logged in the console.

```bash
docker exec -it local_db psql -U local_dev -c "create database e2e_test" local_db  
npm run test:e2e
```

# Troubleshooting

## Restart database from the scratch

Nuking the local development database

```bash
docker-compose down -v
```

## Display database content

```bash
docker exec -it local_db psql -U local_dev -c "select * from users" local_db
```

## Debugging from Visual Studio Code

Visual Studio Code Auto [Attach feature] works.

You just need to run 

```bash
npm run start:debug
```

... and Visual Studio Code will notice this and the debugger bar appears. All breakpoints are honoured.

## Launching Jest from Visual Studio Code

Example launcher how to attach a debugger to Jest tests.

```json
{
    "version": "0.2.0",
    "configurations": [
        
        {
            "type": "node",
            "request": "launch",
            "name": "Jest All",
            "program": "${workspaceFolder}/node_modules/.bin/jest",
            "args": [
                "--runInBand",
                "--config",
                "./test/jest-e2e.json"
            ],
            "console": "integratedTerminal",
            "internalConsoleOptions": "neverOpen",
            "disableOptimisticBPs": true,
            "windows": {
                "program": "${workspaceFolder}/node_modules/jest/bin/jest",
            },
            "env": {
                "PATH": "/Users/moo/.nvm/versions/node/v11.0.0/bin:${env:PATH}"
            },
        },
    ]    
}    
```

# Further reading

[NestJS and TypeORM in 30 minutes](https://blog.theodo.com/2019/05/an-overview-of-nestjs-typeorm-release-your-first-application-in-less-than-30-minutes/)

[Another NestJS and TypeORM tutorial](https://blog.echobind.com/up-and-running-nextjs-and-typeorm-2c4dff5d7250)

[PostgreSQL on Dockerhub](https://hub.docker.com/_/postgres)

[class-validator](https://github.com/typestack/class-validator)

[Cats NestJS + Swagger sample full example code](https://github.com/nestjs/nest/tree/master/sample/11-swagger)

[Testing database interactoin with TypeORM](https://medium.com/@salmon.3e/integration-testing-with-nestjs-and-typeorm-2ac3f77e7628) and [related source code](https://github.com/p-salmon/nestjs-typeorm-integration-tests)

[Mikko's short style guide for TypeScript](https://twitter.com/moo9000/status/1228059823494881288)
