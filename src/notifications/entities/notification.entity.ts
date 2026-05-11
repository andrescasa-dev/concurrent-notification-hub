import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotificationDeliveryStatus } from '../constants/notification-delivery-status';

@Entity({ name: 'notifications' })
export class Notification {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @ApiProperty()
  @Column({ type: 'text' })
  content!: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 64 })
  channel!: string;

  @ApiProperty({
    description:
      'Delivery target for the channel (email address, E.164 phone, or device token).',
    example: 'user@example.com',
    maxLength: 512,
  })
  @Column({ type: 'varchar', length: 512 })
  recipient!: string;

  @ApiProperty({
    description: 'Outcome of the delivery attempt after send.',
    enum: NotificationDeliveryStatus,
    enumName: 'NotificationDeliveryStatus',
    example: NotificationDeliveryStatus.SENT,
  })
  @Column({ type: 'varchar', length: 32 })
  status!: NotificationDeliveryStatus;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
