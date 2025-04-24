import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CampaignRepository } from '@/src/campagin-service/domain/repository/campaign.repository';
import { Campaign } from '@/src/campagin-service/domain/campaign';
import { ProductRepository } from '@/src/product-service/domain/repository/product.repository';
import { CreateCampaignDto } from '@/src/campagin-service/application/dto/create-campaign.dto';
import { CampaignTypeRepository } from '@/src/campagin-service/domain/repository/campaign-type.repository';
import { ProductTypeRepository } from '@/src/product-service/domain/repository/product-type.repository';

@Injectable()
export class CampaignService {
  constructor(
    private dataSource: DataSource,
    private campaignRepository: CampaignRepository,
    private productRepository: ProductRepository,
    private productTypeRepository:ProductTypeRepository,
    private campaignTypeRepository: CampaignTypeRepository,
  ) {}

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    return await this.dataSource.transaction(async (entityManager) => {
      const productType = await this.productTypeRepository.findProductTypeByCode(dto.product.productTypeCode);
      if (!productType) throw new NotFoundException(`ProductType with code ${dto.product.productTypeCode} not found`);

      // const campaignType = await this.campaignRepository.findByCode;



    });
  }
}
