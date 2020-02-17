import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1581940254925 implements MigrationInterface {
    name = 'CreateUsers1581940254925'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "site_user" ("id" SERIAL NOT NULL, "create_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "update_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT LOCALTIMESTAMP, "publicId" uuid NOT NULL DEFAULT uuid_generate_v4(), "displayName" character varying(50) NOT NULL, "confirmedEmail" character varying(50), "pendingEmail" character varying(50) NOT NULL, "emailConfirmationToken" character varying(16), "emailConfirmationRequestedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "emailConfirmationCompletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_ea82afbb67039dcf26685e18875" UNIQUE ("publicId"), CONSTRAINT "UQ_6772278910762738682bcf6cee7" UNIQUE ("displayName"), CONSTRAINT "UQ_6d3ce6d6f690fadd8afecb8e522" UNIQUE ("confirmedEmail"), CONSTRAINT "UQ_cc82af9cc44a24ebec317530190" UNIQUE ("emailConfirmationToken"), CONSTRAINT "PK_f76d6b4853953c63da40bff758d" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "site_user"`, undefined);
    }

}
