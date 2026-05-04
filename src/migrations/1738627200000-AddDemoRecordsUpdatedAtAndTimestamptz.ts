import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Adds updated_at and stores lifecycle columns as timestamptz (UTC instants). */
export class AddDemoRecordsUpdatedAtAndTimestamptz1738627200000 implements MigrationInterface {
  name = 'AddDemoRecordsUpdatedAtAndTimestamptz1738627200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "demo_records"
        ALTER COLUMN "created_at" TYPE TIMESTAMPTZ
        USING "created_at" AT TIME ZONE 'UTC'
    `);
    await queryRunner.query(`
      ALTER TABLE "demo_records"
        ADD "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "demo_records" DROP COLUMN "updated_at"
    `);
    await queryRunner.query(`
      ALTER TABLE "demo_records"
        ALTER COLUMN "created_at" TYPE TIMESTAMP
        USING "created_at" AT TIME ZONE 'UTC'
    `);
  }
}
