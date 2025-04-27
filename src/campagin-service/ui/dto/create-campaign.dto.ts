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
import { CreateProductRequestDto } from '@/src/campagin-service/ui/dto/create-product-request.dto';
import { CreateScheduleRequestDto } from '@/src/campagin-service/ui/dto/create-schedule-request.dto';




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
  @Type(() => CreateProductRequestDto)
  product: CreateProductRequestDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleRequestDto)
  schedules: CreateScheduleRequestDto[];
}
