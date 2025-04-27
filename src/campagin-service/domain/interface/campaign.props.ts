import { CampaignType } from '@/src/campagin-service/domain/campaign.type';
import { InfluencerPlatform } from '@/src/campagin-service/domain/influencer.platform';
import { CampaignSchedule } from '@/src/campagin-service/domain/campaign.schedule';

export interface CampaignProps {
  name: string;
  budget: number;
  peopleCount: number;
  productId: number;
  campaignType: CampaignType;
  influencerPlatform: InfluencerPlatform;
}
