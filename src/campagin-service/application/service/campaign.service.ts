import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CampaignRepository } from '@/src/campagin-service/domain/repository/campaign.repository';
import { Campaign } from '@/src/campagin-service/domain/campaign';
import { CreateCampaignDto } from '@/src/campagin-service/ui/dto/create-campaign.dto';


@Injectable()
export class CampaignService {
  constructor(
    private dataSource: DataSource,
    private campaignRepository: CampaignRepository,

  ) {}

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    return await this.dataSource.transaction(async (manager) => {

    });
  }
}
