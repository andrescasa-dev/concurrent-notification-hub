import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Partial update of stored notification fields only. Does not change channel or trigger delivery.
 */
export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'New title for the notification record.',
    example: 'Updated title',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'New body content for the notification record.',
    example: 'Updated body',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description:
      'New delivery target (email, E.164 phone, or device token) stored on the record.',
    example: '+573116622964',
    maxLength: 512,
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  recipient?: string;
}
