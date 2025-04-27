import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleRequestDto {

  @IsString()
  @IsNotEmpty()
  scheduleTypeCode: string; // 'RECRUIT', 'BID', 'CASTING', 'CONTENT_UPLOAD'

  @IsDate() @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date | null;
}