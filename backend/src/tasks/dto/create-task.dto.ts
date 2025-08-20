import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['todo', 'in_progress', 'done'], required: false })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'done'])
  status?: TaskStatus;

  @ApiProperty({ required: false, type: String, example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ enum: ['low', 'medium', 'high'], required: false })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: TaskPriority;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  tags?: string[];
}
