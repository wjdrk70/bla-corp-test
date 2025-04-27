import { Body, Controller, Post } from '@nestjs/common';
import { CreateCampaignDto } from '@/src/campagin-service/ui/dto/create-campaign.dto';
import { Campaign } from '@/src/campagin-service/domain/campaign';
import { CampaignService } from '@/src/campagin-service/application/service/campaign.service';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async create(@Body() dto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignService.create(dto);
  }
}
