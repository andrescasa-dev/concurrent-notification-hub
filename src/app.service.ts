import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemoRecord } from './entities/demo-record.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DemoRecord)
    private readonly demoRecords: Repository<DemoRecord>,
  ) {}

  getRoot(): string {
    return 'hello world';
  }

  /** Inserts a row into `demo_records` (for integration smoke tests). */
  async createDemoRecord(message: string): Promise<DemoRecord> {
    const row = this.demoRecords.create({ message });
    return this.demoRecords.save(row);
  }
}
