import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('demo_records')
export class DemoRecord {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'smoke test' })
  @Column({ type: 'varchar', length: 500 })
  message: string;

  @ApiProperty({ description: 'Creation instant (UTC)' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update instant (UTC)' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
