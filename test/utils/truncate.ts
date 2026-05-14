import type { DataSource } from 'typeorm';

export async function truncateAll(dataSource: DataSource): Promise<void> {
  await dataSource.query(
    'TRUNCATE users, notifications RESTART IDENTITY CASCADE',
  );
}
