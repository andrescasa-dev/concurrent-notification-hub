import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Renames `createdAt` to `created_at` for SnakeNamingStrategy. */
export class RenameDemoRecordsCreatedAtToSnake1738620000000 implements MigrationInterface {
  name = 'RenameDemoRecordsCreatedAtToSnake1738620000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "demo_records" RENAME COLUMN "createdAt" TO "created_at"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "demo_records" RENAME COLUMN "created_at" TO "createdAt"
    `);
  }
}
