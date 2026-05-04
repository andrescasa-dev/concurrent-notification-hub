import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropDemoRecords1738627300000 implements MigrationInterface {
  name = 'DropDemoRecords1738627300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "demo_records"`);
  }

  public async down(): Promise<void> {
    // Irreversible: demo_records feature removed from the codebase.
  }
}
