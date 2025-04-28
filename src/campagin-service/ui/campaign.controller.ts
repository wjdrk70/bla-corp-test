import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCampaignDto } from '@/src/campagin-service/ui/dto/create-campaign.dto';
import { CampaignService } from '@/src/campagin-service/application/service/campaign.service';
import { CampaignDetailItemDto } from '@/src/campagin-service/ui/dto/campaign-detail-item.dto';
import { PaginatedCampaignListDto } from '@/src/campagin-service/ui/dto/paginated.campaign.list.dto';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedCampaignListDto> {
    return this.campaignService.getAllCampaign(page, limit);
  }

  @Post()
  async create(@Body() dto: CreateCampaignDto): Promise<CampaignDetailItemDto> {
    return this.campaignService.create(dto);
  }
}
