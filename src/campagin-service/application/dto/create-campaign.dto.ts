import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsString() @IsNotEmpty() brandName: string;
  @IsString() @IsNotEmpty() productName: string;
  @IsString() @IsNotEmpty() briefDescription: string;
  @IsString() @IsNotEmpty() guide: string;
  @IsString() @IsNotEmpty() productTypeCode: string; // 'VISIT', 'SERVICE' 등
}

class ScheduleDto {
  @IsString() @IsNotEmpty() scheduleTypeCode: string; // 'RECRUIT', 'BID', 'CASTING', 'CONTENT_UPLOAD'
  @IsDate() @Type(() => Date) startDate: Date;
  @IsOptional() @IsDate() @Type(() => Date) endDate?: Date | null;
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  budget: number;

  @IsInt()
  peopleCount: number;

  @IsString()
  @IsNotEmpty()
  campaignTypeCode: string; // 'RECRUIT', 'BID'

  @IsString()
  @IsNotEmpty()
  influencerPlatformCode: string; // 'YOUTUBE', 'INSTAGRAM'

  @ValidateNested()
  @Type(() => ProductDto)
  product: ProductDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];
}
