import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationRecipientAndStatus1778440100000 implements MigrationInterface {
  name = 'AddNotificationRecipientAndStatus1778440100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "notifications"
      ADD COLUMN "recipient" character varying(512) NOT NULL DEFAULT ''
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications"
      ADD COLUMN "status" character varying(32) NOT NULL DEFAULT 'sent'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "notifications" DROP COLUMN "status"
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications" DROP COLUMN "recipient"
    `);
  }
}
