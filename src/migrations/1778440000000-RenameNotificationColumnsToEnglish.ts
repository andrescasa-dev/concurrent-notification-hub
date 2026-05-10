import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * For databases that already ran CreateNotificationsTable with Spanish column names
 * (titulo, contenido, canal), rename to English. No-op if columns are already English.
 */
export class RenameNotificationColumnsToEnglish1778440000000 implements MigrationInterface {
  name = 'RenameNotificationColumnsToEnglish1778440000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'titulo'
        ) THEN
          ALTER TABLE "notifications" RENAME COLUMN "titulo" TO "title";
        END IF;
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'contenido'
        ) THEN
          ALTER TABLE "notifications" RENAME COLUMN "contenido" TO "content";
        END IF;
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'canal'
        ) THEN
          ALTER TABLE "notifications" RENAME COLUMN "canal" TO "channel";
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'title'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'titulo'
        ) THEN
          ALTER TABLE "notifications" RENAME COLUMN "title" TO "titulo";
        END IF;
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'content'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'contenido'
        ) THEN
          ALTER TABLE "notifications" RENAME COLUMN "content" TO "contenido";
        END IF;
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'channel'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'notifications' AND column_name = 'canal'
        ) THEN
          ALTER TABLE "notifications" RENAME COLUMN "channel" TO "canal";
        END IF;
      END $$;
    `);
  }
}
