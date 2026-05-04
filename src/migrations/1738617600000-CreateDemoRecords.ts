import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDemoRecords1738617600000 implements MigrationInterface {
  name = 'CreateDemoRecords1738617600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "demo_records" (
        "id" SERIAL NOT NULL,
        "message" character varying(500) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_demo_records_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "demo_records"`);
  }
}
