import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1581622263207 implements MigrationInterface {
    name = 'CreateUsers1581622263207'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "publidId" uuid NOT NULL DEFAULT uuid_generate_v4(), "displayName" character varying(50) NOT NULL, "confirmedEmail" character varying(50), "pendingEmail" character varying(50) NOT NULL, "emailConfirmationRequestedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "emailConfirmationCompletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_198f2af62a0a29be0e71991abe0" UNIQUE ("publidId"), CONSTRAINT "UQ_059e69c318702e93998f26d1528" UNIQUE ("displayName"), CONSTRAINT "UQ_934f524f5b655d6061ee140395f" UNIQUE ("confirmedEmail"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
