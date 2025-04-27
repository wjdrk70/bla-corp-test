
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './domain/campaign';
import { CampaignType } from './domain/campaign.type';
import { CampaignSchedule } from './domain/campaign.schedule';
import { ScheduleType } from './domain/schedule.type';
import { InfluencerPlatform } from './domain/influencer.platform';
import { CampaignRepository } from './domain/repository/campaign.repository';
import { CampaignTypeRepository } from './domain/repository/campaign-type-repository';
import { CampaignScheduleRepository } from './domain/repository/campaign-schedule.repository';
import { ScheduleTypeRepository } from './domain/repository/scehduel-type.repository';
import { InfluencePlatformRepository } from './domain/repository/influence-platform.repository';
import { CampaignDomainService } from './domain/service/campaign.domain.service';
import { CampaignService } from './application/service/campaign.service';
import { CampaignController } from './ui/campaign.controller';
import { ProductModule } from '../product-service/product.module';
import { DatabaseModule } from '../databases/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      Campaign,
      CampaignType,
      CampaignSchedule,
      ScheduleType,
      InfluencerPlatform,
    ]),
    ProductModule,
  ],
  controllers: [CampaignController],
  providers: [
    CampaignRepository,
    CampaignTypeRepository,
    CampaignScheduleRepository,
    ScheduleTypeRepository,
    InfluencePlatformRepository,
    CampaignDomainService,
    CampaignService,
  ],
  exports: [CampaignService],
})
export class CampaignModule {}